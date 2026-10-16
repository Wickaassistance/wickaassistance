// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType) => {
  return new Response(arrayBuffer, { headers: { "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase()) } }).formData();
};

// node_modules/hono/dist/utils/body.js
var MAX_NESTED_OBJECTS = 1e4;
var isRawRequest = (request) => "headers" in request;
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const mediaType = (isRawRequest(request) ? request.headers : request.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") return parseFormData(request, {
    all,
    dot
  });
  return {};
};
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData) return convertFormDataToBodyData(await request.bodyCache.formData, options);
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) request.bodyCache.formData = formDataPromise;
  const formData = await formDataPromise;
  if (formData) return convertFormDataToBodyData(formData, options);
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form2 = /* @__PURE__ */ Object.create(null);
  const nestingState = { count: 0 };
  formData.forEach((value, key) => {
    if (!(options.all || key.endsWith("[]"))) form2[key] = value;
    else handleParsingAllValues(form2, key, value);
  });
  if (options.dot) Object.entries(form2).forEach(([key, value]) => {
    if (key.includes(".")) {
      handleParsingNestedValues(form2, key, value, nestingState);
      delete form2[key];
    }
  });
  return form2;
}
var handleParsingAllValues = (form2, key, value) => {
  if (form2[key] !== void 0) {
    if (Array.isArray(form2[key])) form2[key].push(value);
    else form2[key] = [form2[key], value];
  } else if (!key.endsWith("[]")) form2[key] = value;
  else form2[key] = [value];
};
var handleParsingNestedValues = (form2, key, value, state) => {
  if (/(?:^|\.)__proto__\./.test(key)) return;
  let nestedForm = form2;
  const keys = key.split(".", 34);
  if (keys.length > 33) throwNestingLimitExceeded();
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) nestedForm[key2] = value;
    else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        if (state.count++ >= MAX_NESTED_OBJECTS) throwNestingLimitExceeded();
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};
var throwNestingLimitExceeded = () => {
  throw new Error("Nesting limit exceeded");
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") paths.shift();
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return {
    groups,
    path
  };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) if (paths[j].includes(mark)) {
      paths[j] = paths[j].replace(mark, groups[i][1]);
      break;
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") return "*";
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [
        cacheKey,
        match2[1],
        new RegExp(`^${match2[2]}(?=/${next})`)
      ] : [
        label,
        match2[1],
        new RegExp(`^${match2[2]}$`)
      ];
      else patternCache[cacheKey] = [
        label,
        match2[1],
        true
      ];
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) break;
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) sub = mergePath(sub, ...rest);
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) return null;
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) basePath += "/" + segment;
    else if (/\:/.test(segment)) {
      if (segment.charCodeAt(segment.length - 1) === 63) {
        if (results.length === 0 && basePath === "") results.push("/");
        else results.push(basePath);
        const optionalSegment = segment.slice(0, -1);
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else basePath += "/" + segment;
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var tryDecodeURIComponent = (str) => str.indexOf("%") !== -1 ? tryDecode(str, decodeURIComponent_) : str;
var _decodeURI = (value) => {
  if (value.indexOf("+") !== -1) value = value.replace(/\+/g, " ");
  return tryDecodeURIComponent(value);
};
var _getQueryParam = (url, key, multiple) => {
  const hashIndex = url.indexOf("#", 8);
  if (hashIndex !== -1) url = url.slice(0, hashIndex);
  let encoded;
  if (!multiple && key && key.indexOf("%") === -1 && key.indexOf("+") === -1) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) return;
    if (!url.startsWith(key, keyIndex2 + 1)) keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) return "";
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) return;
  }
  const results = /* @__PURE__ */ Object.create(null);
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) valueIndex = -1;
    let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex);
    if (encoded) name = _decodeURI(name);
    keyIndex = nextKeyIndex;
    if (name === "") continue;
    let value;
    if (valueIndex === -1) value = "";
    else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) value = _decodeURI(value);
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) results[name] = [];
      results[name].push(value);
    } else results[name] ??= value;
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var HonoRequest = class {
  /**
  * `.raw` can get the raw Request object.
  *
  * @see {@link https://hono.dev/docs/api/request#raw}
  *
  * @example
  * ```ts
  * // For Cloudflare Workers
  * app.post('/', async (c) => {
  *   const metadata = c.req.raw.cf?.hostMetadata?
  *   ...
  * })
  * ```
  */
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  /**
  * `.path` can get the pathname of the request.
  *
  * @see {@link https://hono.dev/docs/api/request#path}
  *
  * @example
  * ```ts
  * app.get('/about/me', (c) => {
  *   const pathname = c.req.path // `/about/me`
  * })
  * ```
  */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex]?.[1][key];
    const param = this.#getParamValue(paramKey);
    return param && tryDecodeURIComponent(param);
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex]?.[1] ?? {});
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) decoded[key] = tryDecodeURIComponent(value);
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) return this.raw.headers.get(name) ?? void 0;
    const headerData = /* @__PURE__ */ Object.create(null);
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) return cachedBody;
    for (const anyCachedKey in bodyCache) return bodyCache[anyCachedKey].then((body) => {
      if (anyCachedKey === "json") body = JSON.stringify(body);
      const contentType = anyCachedKey === "formData" ? void 0 : raw2.headers.get("content-type");
      return new Response(body, { headers: contentType ? { "Content-Type": contentType } : void 0 })[key]();
    });
    return bodyCache[key] = raw2[key]();
  };
  /**
  * `.json()` can parse Request body of type `application/json`
  *
  * @see {@link https://hono.dev/docs/api/request#json}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.json()
  * })
  * ```
  */
  json() {
    return this.#cachedBody("text").then((text2) => JSON.parse(text2));
  }
  /**
  * `.text()` can parse Request body of type `text/plain`
  *
  * @see {@link https://hono.dev/docs/api/request#text}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.text()
  * })
  * ```
  */
  text() {
    return this.#cachedBody("text");
  }
  /**
  * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
  *
  * @see {@link https://hono.dev/docs/api/request#arraybuffer}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.arrayBuffer()
  * })
  * ```
  */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
  * `.bytes()` parses the request body as a `Uint8Array`.
  *
  * @see {@link https://hono.dev/docs/api/request#bytes}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.bytes()
  * })
  * ```
  */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
  * Parses the request body as a `Blob`.
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.blob();
  * });
  * ```
  * @see https://hono.dev/docs/api/request#blob
  */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
  * Parses the request body as `FormData`.
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.formData();
  * });
  * ```
  * @see https://hono.dev/docs/api/request#formdata
  */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
  * Adds validated data to the request.
  *
  * @param target - The target of the validation.
  * @param data - The validated data to add.
  */
  addValidatedData(target, data) {
    (this.#validatedData ??= {})[target] = data;
  }
  valid(target) {
    return this.#validatedData?.[target];
  }
  /**
  * `.url` can get the request url strings.
  *
  * @see {@link https://hono.dev/docs/api/request#url}
  *
  * @example
  * ```ts
  * app.get('/about/me', (c) => {
  *   const url = c.req.url // `http://localhost:8787/about/me`
  *   ...
  * })
  * ```
  */
  get url() {
    return this.raw.url;
  }
  /**
  * `.method` can get the method name of the request.
  *
  * @see {@link https://hono.dev/docs/api/request#method}
  *
  * @example
  * ```ts
  * app.get('/about/me', (c) => {
  *   const method = c.req.method // `GET`
  * })
  * ```
  */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
  * `.matchedRoutes` can return a matched route in the handler
  *
  * @deprecated
  *
  * Use matchedRoutes helper defined in "hono/route" instead.
  *
  * @see {@link https://hono.dev/docs/api/request#matchedroutes}
  *
  * @example
  * ```ts
  * app.use('*', async function logger(c, next) {
  *   await next()
  *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
  *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
  *     console.log(
  *       method,
  *       ' ',
  *       path,
  *       ' '.repeat(Math.max(10 - path.length, 0)),
  *       name,
  *       i === c.req.routeIndex ? '<- respond from here' : ''
  *     )
  *   })
  * })
  * ```
  */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
  * `.routePath` can retrieve the path registered within the handler
  *
  * @deprecated
  *
  * Use routePath helper defined in "hono/route" instead.
  *
  * @see {@link https://hono.dev/docs/api/request#routepath}
  *
  * @example
  * ```ts
  * app.get('/posts/:id', (c) => {
  *   return c.json({ path: c.req.routePath })
  * })
  * ```
  */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var escapeRe = /[&<>'"]/;
var stringBufferToString = async (buffer, callbacks) => {
  let str = "";
  callbacks ||= [];
  const resolvedBuffer = await Promise.all(buffer);
  for (let i = resolvedBuffer.length - 1; ; i--) {
    str += resolvedBuffer[i];
    i--;
    if (i < 0) break;
    let r = resolvedBuffer[i];
    if (typeof r === "object") callbacks.push(...r.callbacks || []);
    const isEscaped = r.isEscaped;
    r = await (typeof r === "object" ? r.toString() : r);
    if (typeof r === "object") callbacks.push(...r.callbacks || []);
    if (r.isEscaped ?? isEscaped) str += r;
    else {
      const buf = [str];
      escapeToBuffer(r, buf);
      str = buf[0];
    }
  }
  return raw(str, callbacks);
};
var escapeToBuffer = (str, buffer) => {
  const match2 = str.search(escapeRe);
  if (match2 === -1) {
    buffer[0] += str;
    return;
  }
  let escape;
  let index;
  let lastIndex = 0;
  for (index = match2; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        escape = "&quot;";
        break;
      case 39:
        escape = "&#39;";
        break;
      case 38:
        escape = "&amp;";
        break;
      case 60:
        escape = "&lt;";
        break;
      case 62:
        escape = "&gt;";
        break;
      default:
        continue;
    }
    buffer[0] += str.substring(lastIndex, index) + escape;
    lastIndex = index + 1;
  }
  buffer[0] += str.substring(lastIndex, index);
};
var resolveCallbackSync = (str) => {
  const callbacks = str.callbacks;
  if (!callbacks?.length) return str;
  const buffer = [str];
  const context = {};
  callbacks.forEach((c) => c({
    phase: HtmlEscapedCallbackPhase.Stringify,
    buffer,
    context
  }));
  return buffer[0];
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) str = str.toString();
    if (str instanceof Promise) str = await str;
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) return Promise.resolve(str);
  if (buffer) buffer[0] += str;
  else buffer = [str];
  const resStr = Promise.all(callbacks.map((c) => c({
    phase,
    buffer,
    context
  }))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
  if (preserveCallbacks) return raw(await resStr, callbacks);
  else return resStr;
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  /**
  * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
  *
  * @see {@link https://hono.dev/docs/api/context#env}
  *
  * @example
  * ```ts
  * // Environment object for Cloudflare Workers
  * app.get('*', async c => {
  *   const counter = c.env.COUNTER
  * })
  * ```
  */
  env = {};
  #var;
  finalized = false;
  /**
  * `.error` can get the error object from the middleware if the Handler throws an error.
  *
  * @see {@link https://hono.dev/docs/api/context#error}
  *
  * @example
  * ```ts
  * app.use('*', async (c, next) => {
  *   await next()
  *   if (c.error) {
  *     // do something...
  *   }
  * })
  * ```
  */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
  * Creates an instance of the Context class.
  *
  * @param req - The Request object.
  * @param options - Optional configuration options for the context.
  */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
  * `.req` is the instance of {@link HonoRequest}.
  */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
  * @see {@link https://hono.dev/docs/api/context#event}
  * The FetchEvent associated with the current request.
  *
  * @throws Will throw an error if the context does not have a FetchEvent.
  */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) return this.#executionCtx;
    else throw Error("This context has no FetchEvent");
  }
  /**
  * @see {@link https://hono.dev/docs/api/context#executionctx}
  * The ExecutionContext associated with the current request.
  *
  * @throws Will throw an error if the context does not have an ExecutionContext.
  */
  get executionCtx() {
    if (this.#executionCtx) return this.#executionCtx;
    else throw Error("This context has no ExecutionContext");
  }
  /**
  * @see {@link https://hono.dev/docs/api/context#res}
  * The Response object for the current request.
  */
  get res() {
    return this.#res ||= createResponseInstance(null, { headers: this.#preparedHeaders ??= new Headers() });
  }
  /**
  * Sets the Response object for the current request.
  *
  * @param _res - The Response object to set.
  */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") continue;
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) _res.headers.append("set-cookie", cookie);
        } else _res.headers.set(k, v);
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
  * `.render()` can create a response within a layout.
  *
  * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
  *
  * @example
  * ```ts
  * app.get('/', (c) => {
  *   return c.render('Hello!')
  * })
  * ```
  */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
  * Sets the layout for the response.
  *
  * @param layout - The layout to set.
  * @returns The layout function.
  */
  setLayout = (layout) => this.#layout = layout;
  /**
  * Gets the current layout for the response.
  *
  * @returns The current layout function.
  */
  getLayout = () => this.#layout;
  /**
  * `.setRenderer()` can set the layout in the custom middleware.
  *
  * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
  *
  * @example
  * ```tsx
  * app.use('*', async (c, next) => {
  *   c.setRenderer((content) => {
  *     return c.html(
  *       <html>
  *         <body>
  *           <p>{content}</p>
  *         </body>
  *       </html>
  *     )
  *   })
  *   await next()
  * })
  * ```
  */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
  * `.header()` can set headers.
  *
  * @see {@link https://hono.dev/docs/api/context#header}
  *
  * @example
  * ```ts
  * app.get('/welcome', (c) => {
  *   // Set headers
  *   c.header('X-Message', 'Hello!')
  *   c.header('Content-Type', 'text/plain')
  *
  *   // Append multiple headers using the append option (e.g. Vary)
  *   c.header('Vary', 'Accept-Encoding', { append: true })
  *   c.header('Vary', 'User-Agent', { append: true })
  *
  *   return c.body('Thank you for coming')
  * })
  * ```
  */
  header = (name, value, options) => {
    if (this.finalized) this.#res = createResponseInstance(this.#res.body, this.#res);
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) headers.delete(name);
    else if (options?.append) headers.append(name, value);
    else headers.set(name, value);
  };
  status = (status) => {
    this.#status = status;
  };
  /**
  * `.set()` can set the value specified by the key.
  *
  * @see {@link https://hono.dev/docs/api/context#set-get}
  *
  * @example
  * ```ts
  * app.use('*', async (c, next) => {
  *   c.set('message', 'Hono is hot!!')
  *   await next()
  * })
  * ```
  */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
  * `.get()` can use the value specified by the key.
  *
  * @see {@link https://hono.dev/docs/api/context#set-get}
  *
  * @example
  * ```ts
  * app.get('/', (c) => {
  *   const message = c.get('message')
  *   return c.text(`The message is "${message}"`)
  * })
  * ```
  */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
  * `.var` can access the value of a variable.
  *
  * @see {@link https://hono.dev/docs/api/context#var}
  *
  * @example
  * ```ts
  * const result = c.var.client.oneMethod()
  * ```
  */
  get var() {
    if (!this.#var) return {};
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    let responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders;
    if (typeof arg === "object" && arg.headers) {
      responseHeaders ??= new Headers();
      for (const [key, value] of new Headers(arg.headers)) if (key === "set-cookie") responseHeaders.append(key, value);
      else responseHeaders.set(key, value);
    }
    if (headers) {
      if (!responseHeaders) {
        let count = 0;
        for (const k in headers) if (++count > 1 || typeof headers[k] !== "string") {
          responseHeaders = new Headers();
          break;
        }
      }
      if (responseHeaders) for (const k in headers) {
        const v = headers[k];
        if (typeof v === "string") responseHeaders.set(k, v);
        else {
          responseHeaders.delete(k);
          for (const v2 of v) responseHeaders.append(k, v2);
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, {
      status,
      headers: responseHeaders ?? headers
    });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
  * `.body()` can return the HTTP response.
  * You can set headers with `.header()` and set HTTP status code with `.status`.
  * This can also be set in `.text()`, `.json()` and so on.
  *
  * @see {@link https://hono.dev/docs/api/context#body}
  *
  * @example
  * ```ts
  * app.get('/welcome', (c) => {
  *   // Set headers
  *   c.header('X-Message', 'Hello!')
  *   c.header('Content-Type', 'text/plain')
  *   // Set HTTP status code
  *   c.status(201)
  *
  *   // Return the response body
  *   return c.body('Thank you for coming')
  * })
  * ```
  */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
  * `.text()` can render text as `Content-Type:text/plain`.
  *
  * @see {@link https://hono.dev/docs/api/context#text}
  *
  * @example
  * ```ts
  * app.get('/say', (c) => {
  *   return c.text('Hello!')
  * })
  * ```
  */
  text = (text2, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text2) : this.#newResponse(text2, arg, setDefaultContentType(TEXT_PLAIN, headers));
  };
  /**
  * `.json()` can render JSON as `Content-Type:application/json`.
  *
  * @see {@link https://hono.dev/docs/api/context#json}
  *
  * @example
  * ```ts
  * app.get('/api', (c) => {
  *   return c.json({ message: 'Hello!' })
  * })
  * ```
  */
  json = (object, arg, headers) => {
    return this.#newResponse(JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
  };
  html = (html2, arg, headers) => {
    const res = (html3) => this.#newResponse(html3, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html2 === "object" ? resolveCallback(html2, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html2);
  };
  /**
  * `.redirect()` can Redirect, default status code is 302.
  *
  * @see {@link https://hono.dev/docs/api/context#redirect}
  *
  * @example
  * ```ts
  * app.get('/redirect', (c) => {
  *   return c.redirect('/')
  * })
  * app.get('/redirect-permanently', (c) => {
  *   return c.redirect('/', 301)
  * })
  * ```
  */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header("Location", !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString));
    return this.newResponse(null, status ?? 302);
  };
  /**
  * `.notFound()` can return the Not Found Response.
  *
  * @see {@link https://hono.dev/docs/api/context#notfound}
  *
  * @example
  * ```ts
  * app.get('/notfound', (c) => {
  *   return c.notFound()
  * })
  * ```
  */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;
      let res;
      let isError = false;
      let handler2;
      if (middleware[i]) {
        handler2 = middleware[i][0][0];
        context.req.routeIndex = i;
      } else handler2 = i === middleware.length && next || void 0;
      if (handler2) try {
        res = await handler2(context, () => dispatch(i + 1));
      } catch (err) {
        if (err instanceof Error && onError) {
          context.error = err;
          res = await onError(err, context);
          isError = true;
        } else throw err;
      }
      else if (context.finalized === false && onNotFound) res = await onNotFound(context);
      if (res && (context.finalized === false || isError)) context.res = res;
      return context;
    }
  };
};

// node_modules/hono/dist/router.js
var METHODS = [
  "get",
  "post",
  "put",
  "delete",
  "options",
  "patch",
  "query"
];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class Hono2 {
  get;
  post;
  put;
  delete;
  options;
  patch;
  query;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    [...METHODS, "all"].forEach((method) => {
      this[method] = (args1, ...args) => {
        const methodName = method.toUpperCase();
        if (typeof args1 === "string") this.#path = args1;
        else this.#addRoute(methodName, this.#path, args1);
        args.forEach((handler2) => {
          this.#addRoute(methodName, this.#path, handler2);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          const methodName = m.toUpperCase();
          for (const handler2 of handlers) this.#addRoute(methodName, this.#path, handler2);
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") this.#path = arg1;
      else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler2) => {
        this.#addRoute("ALL", this.#path, handler2);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono2({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  /**
  * `.route()` allows grouping other Hono instance in routes.
  *
  * @see {@link https://hono.dev/docs/api/routing#grouping}
  *
  * @param {string} path - base Path
  * @param {Hono} app - other Hono instance
  * @returns {Hono} routed Hono instance
  *
  * @example
  * ```ts
  * const app = new Hono()
  * const app2 = new Hono()
  *
  * app2.get("/user", (c) => c.text("user"))
  * app.route("/api", app2) // GET /api/user
  * ```
  */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler2;
      if (app2.errorHandler === errorHandler) handler2 = r.handler;
      else {
        handler2 = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler2[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler2, r.basePath);
    });
    return this;
  }
  /**
  * `.basePath()` allows base paths to be specified.
  *
  * @see {@link https://hono.dev/docs/api/routing#base-path}
  *
  * @param {string} path - base Path
  * @returns {Hono} changed Hono instance
  *
  * @example
  * ```ts
  * const api = new Hono().basePath('/api')
  * ```
  */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
  * `.onError()` handles an error and returns a customized Response.
  *
  * @see {@link https://hono.dev/docs/api/hono#error-handling}
  *
  * @param {ErrorHandler} handler - request Handler for error
  * @returns {Hono} changed Hono instance
  *
  * @example
  * ```ts
  * app.onError((err, c) => {
  *   console.error(`${err}`)
  *   return c.text('Custom Error Message', 500)
  * })
  * ```
  */
  onError = (handler2) => {
    this.errorHandler = handler2;
    return this;
  };
  /**
  * `.notFound()` allows you to customize a Not Found Response.
  *
  * @see {@link https://hono.dev/docs/api/hono#not-found}
  *
  * @param {NotFoundHandler} handler - request handler for not-found
  * @returns {Hono} changed Hono instance
  *
  * @example
  * ```ts
  * app.notFound((c) => {
  *   return c.text('Custom 404 Message', 404)
  * })
  * ```
  */
  notFound = (handler2) => {
    this.#notFoundHandler = handler2;
    return this;
  };
  /**
  * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
  *
  * @deprecated Use `mount()` from `hono/mount` instead. `.mount()` will be removed in v5.
  *
  * @see {@link https://hono.dev/docs/api/hono#mount}
  *
  * @param {string} path - base Path
  * @param {Function} applicationHandler - other Request Handler
  * @param {MountOptions} [options] - options of `.mount()`
  * @returns {Hono} mounted Hono instance
  *
  * @example
  * ```ts
  * import { Router as IttyRouter } from 'itty-router'
  * import { Hono } from 'hono'
  * // Create itty-router application
  * const ittyRouter = IttyRouter()
  * // GET /itty-router/hello
  * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
  *
  * const app = new Hono()
  * app.mount('/itty-router', ittyRouter.handle)
  * ```
  *
  * @example
  * ```ts
  * const app = new Hono()
  * // Send the request to another application without modification.
  * app.mount('/app', anotherApp, {
  *   replaceRequest: (req) => req,
  * })
  * ```
  */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") optionHandler = options;
      else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) replaceRequest = (request) => request;
        else replaceRequest = options.replaceRequest;
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler2 = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) return res;
      await next();
    };
    this.#addRoute("ALL", mergePath(path, "*"), handler2);
    return this;
  }
  #addRoute(method, path, handler2, baseRoutePath) {
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler: handler2
    };
    this.router.add(method, path, [handler2, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) return this.errorHandler(err, c);
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
  * `.fetch()` will be entry point of your app.
  *
  * @see {@link https://hono.dev/docs/api/hono#fetch}
  *
  * @param {Request} request - request Object of request
  * @param {Env} env - env Object
  * @param {ExecutionContext} executionCtx - context of execution
  * @returns {Response | Promise<Response>} response of request
  *
  */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
  * `.request()` is a useful method for testing.
  * You can pass a URL or pathname to send a GET request.
  * app will return a Response object.
  * ```ts
  * test('GET /hello is ok', async () => {
  *   const res = await app.request('/hello')
  *   expect(res.status).toBe(200)
  * })
  * ```
  * @see https://hono.dev/docs/api/hono#request
  */
  request = (input2, requestInit, Env, executionCtx) => {
    if (input2 instanceof Request) return this.fetch(requestInit ? new Request(input2, requestInit) : input2, Env, executionCtx);
    input2 = input2.toString();
    return this.fetch(new Request(/^https?:\/\//.test(input2) ? input2 : `http://localhost${mergePath("/", input2)}`, requestInit), Env, executionCtx);
  };
  /**
  * `.fire()` automatically adds a global fetch event listener.
  * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
  * @deprecated
  * Use `fire` from `hono/service-worker` instead.
  * ```ts
  * import { Hono } from 'hono'
  * import { fire } from 'hono/service-worker'
  *
  * const app = new Hono()
  * // ...
  * fire(app)
  * ```
  * @see https://hono.dev/docs/api/hono#fire
  * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
  * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
  */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/utils.js
var createNullObject = () => /* @__PURE__ */ Object.create(null);

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path2) => {
    const matcher = matchers[method2] || matchers["ALL"];
    const staticMatch = matcher[2][path2];
    if (staticMatch) return staticMatch;
    const match3 = path2.match(matcher[0]);
    if (!match3) return [[], emptyParam];
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  });
  this.match = match2;
  return match2(method, path);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = /* @__PURE__ */ new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) return b.length === 1 ? a < b ? -1 : 1 : -1;
  if (b.length === 1) return 1;
  if (a === ".*" || a === "(?:|/.*)") return b === "(?:|/.*)" ? -1 : 1;
  else if (b === ".*" || b === "(?:|/.*)") return -1;
  if (a === "[^/]+") return 1;
  else if (b === "[^/]+") return -1;
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class Node2 {
  #index;
  #varIndex;
  #children = createNullObject();
  insert(tokens, index, paramMap, context, isStatic) {
    let node = this;
    for (let i = 0, len = tokens.length; i < len; i++) {
      const token = tokens[i];
      const pattern = token.length === 1 ? token === "*" ? i === len - 1 ? [
        "",
        "",
        ".*"
      ] : [
        "",
        "",
        LABEL_REG_EXP_STR
      ] : null : token === "/*" ? [
        "",
        "",
        TAIL_WILDCARD_REG_EXP_STR
      ] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      let nextNode;
      if (pattern) {
        const name = pattern[1];
        let regexpStr = pattern[2] || "[^/]+";
        if (name && pattern[2]) {
          if (regexpStr === ".*") throw PATH_ERROR;
          regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
          if (/\((?!\?:)/.test(regexpStr)) throw PATH_ERROR;
          if (regexpStr.length === 1 && regExpMetaChars.has(regexpStr)) throw PATH_ERROR;
        }
        nextNode = node.#children[regexpStr];
        if (!nextNode) {
          if (regexpStr !== ".*" && regexpStr !== "(?:|/.*)") {
            for (const k in node.#children) if ((regexpStr.length > 1 || k.length > 1) && k !== ".*" && k !== "(?:|/.*)") throw PATH_ERROR;
          }
          nextNode = node.#children[regexpStr] = new Node2();
        }
        if (name !== "") {
          nextNode.#varIndex ??= context.varIndex++;
          paramMap.push([name, nextNode.#varIndex]);
        }
      } else {
        nextNode = node.#children[token];
        if (!nextNode) {
          for (const k in node.#children) if (k.length > 1 && k !== ".*" && k !== "(?:|/.*)") throw PATH_ERROR;
          nextNode = node.#children[token] = new Node2();
        }
      }
      node = nextNode;
    }
    if (node.#index !== void 0) throw PATH_ERROR;
    node.#index = isStatic ? -1 : index;
  }
  buildRegExpStr() {
    const strList = Object.keys(this.#children).sort(compareKey).map((k) => {
      const c = this.#children[k];
      const childStr = c.buildRegExpStr();
      return childStr === "" ? "" : (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + childStr;
    }).filter(Boolean);
    if (typeof this.#index === "number" && this.#index !== -1) strList.unshift(`#${this.#index}`);
    if (strList.length === 0) return "";
    if (strList.length === 1) return strList[0];
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  #index = 0;
  paths = createNullObject();
  insert(path, isStatic) {
    if (isStatic) {
      this.#root.insert(path.split(""), 0, [], this.#context, true);
      return;
    }
    const paramAssoc = [];
    const groups = [];
    let markedPath = path;
    for (let i = 0; ; ) {
      let replaced = false;
      markedPath = markedPath.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) break;
    }
    const tokens = markedPath.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) if (tokens[j].indexOf(mark) !== -1) {
        tokens[j] = tokens[j].replace(mark, groups[i][1]);
        break;
      }
    }
    this.#root.insert(tokens, this.#index, paramAssoc, this.#context, false);
    this.paths[path] = [this.#index++, paramAssoc];
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") return [
      /^$/,
      [],
      []
    ];
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [
      new RegExp(`^${regexp}`),
      indexReplacementMap,
      paramReplacementMap
    ];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var wildcardRegExpCache = createNullObject();
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(`^${path.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g, (match2, metaChar) => metaChar ? `\\${metaChar}` : match2 === "/*" ? TAIL_WILDCARD_REG_EXP_STR : match2 === "*" ? ".*" : `/:${LABEL_REG_EXP_STR}`)}$`);
}
function findMiddleware(middleware, path) {
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) if (buildWildcardRegExp(k).test(path)) return [...middleware[k]];
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  #tries;
  constructor() {
    this.#middleware = { ["ALL"]: createNullObject() };
    this.#routes = { ["ALL"]: createNullObject() };
    this.#tries = { ["ALL"]: new Trie() };
  }
  #insertPath(method, path) {
    try {
      this.#tries[method].insert(path, !/\*|\/:/.test(path));
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
  }
  add(method, path, handler2) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware) throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    if (!middleware[method]) {
      this.#tries[method] = new Trie();
      for (const handlerMap of [middleware, routes]) {
        handlerMap[method] = createNullObject();
        for (const p in handlerMap["ALL"]) {
          handlerMap[method][p] = [...handlerMap["ALL"][p]];
          this.#insertPath(method, p);
        }
      }
    }
    if (path === "/*") path = "*";
    const methods = method === "ALL" ? Object.keys(middleware) : [method];
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      for (const m of methods) if (!middleware[m][path]) {
        this.#insertPath(m, path);
        middleware[m][path] = findMiddleware(middleware[m], path) || findMiddleware(middleware["ALL"], path) || [];
      }
      for (const handlerMap of [middleware, routes]) for (const m of methods) for (const p in handlerMap[m]) re.test(p) && handlerMap[m][p].push([handler2, path]);
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (const path2 of paths) for (const m of methods) {
      if (!routes[m][path2]) {
        this.#insertPath(m, path2);
        routes[m][path2] = findMiddleware(middleware[m], path2) || findMiddleware(middleware["ALL"], path2) || [];
      }
      routes[m][path2].push([handler2, path2]);
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = createNullObject();
    for (const method of Object.keys(this.#routes)) matchers[method] = this.#buildMatcher(method);
    this.#middleware = this.#routes = this.#tries = void 0;
    wildcardRegExpCache = createNullObject();
    return matchers;
  }
  #buildMatcher(method) {
    const middleware = this.#middleware[method];
    const routes = this.#routes[method];
    const trie = this.#tries[method];
    const staticMap = createNullObject();
    const handlerData = [];
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    for (const r of [middleware, routes]) for (const path in r) {
      const handlers = r[path];
      const pathData = trie.paths[path];
      if (!pathData) {
        staticMap[path] = [handlers.map(([h]) => [h, createNullObject()]), emptyParam];
        continue;
      }
      handlerData[pathData[0]] = handlers.map(([h, handlerPath]) => [h, trie.paths[handlerPath][1].reduceRight((map, [key], i) => {
        map[key] = paramReplacementMap[pathData[1][i][1]];
        return map;
      }, createNullObject())]);
    }
    return [
      regexp,
      indexReplacementMap.map((i) => handlerData[i]),
      staticMap
    ];
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler2) {
    if (!this.#routes) throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    this.#routes.push([
      method,
      path,
      handler2
    ]);
  }
  match(method, path) {
    if (!this.#routes) throw new Error("Fatal error");
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) router.add(...routes[i2]);
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) continue;
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) throw new Error("Fatal error");
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) throw new Error("No active router has been determined yet.");
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = createNullObject();
var order = 0;
var Node3 = class Node4 {
  #methods = [];
  #children = createNullObject();
  #patterns = [];
  #pattern;
  #params = emptyParams;
  insert(method, path, handler2) {
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = /* @__PURE__ */ new Set();
    let i = 0;
    for (const p of parts) {
      const nextP = parts[++i];
      const pattern = getPattern(p, nextP) || (nextP === void 0 && p && p.indexOf("*") === p.length - 1 ? p : null);
      const isParam = Array.isArray(pattern);
      const key = isParam ? pattern[0] : pattern || p;
      const child = curNode.#children[key] ||= new Node4();
      if (pattern && !child.#pattern) {
        child.#pattern = pattern;
        curNode.#patterns.push(child);
      }
      curNode = child;
      if (isParam) possibleKeys.add(pattern[1]);
    }
    curNode.#methods.push({ [method]: {
      handler: handler2,
      possibleKeys: [...possibleKeys],
      score: ++order
    } });
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m["ALL"];
      if (handlerSet) {
        handlerSet.params = createNullObject();
        handlerSets.push(handlerSet);
        for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
          const key = handlerSet.possibleKeys[i2];
          handlerSet.params[key] = params?.[key] && !i2 ? params[key] : nodeParams[key] ?? params?.[key];
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    let curNodes = [this];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else tempNodes.push(nextNode);
        }
        for (const child of node.#patterns) {
          const pattern = child.#pattern;
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (typeof pattern === "string") {
            if (pattern === "*" || part.startsWith(pattern.slice(0, -1))) {
              this.#pushHandlerSets(handlerSets, child, method, node.#params);
              if (pattern === "*") {
                child.#params = params;
                tempNodes.push(child);
              }
            }
            continue;
          }
          const [, name, matcher] = pattern;
          if (!part && matcher === true) continue;
          if (matcher !== true) {
            if (!partOffsets) {
              partOffsets = [];
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.slice(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) this.#pushHandlerSets(handlerSets, child.#children["*"], method, node.#params, params);
              for (const _ in child.#children) {
                child.#params = params;
                const componentCount = m[0].match(/\//g)?.length ?? 0;
                (curNodesQueue[componentCount] ||= []).push(child);
                break;
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) this.#pushHandlerSets(handlerSets, child.#children["*"], method, params, node.#params);
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets[1]) handlerSets.sort((a, b) => {
      return a.score - b.score;
    });
    return [handlerSets.map(({ handler: handler2, params }) => [handler2, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node = new Node3();
  add(method, path, handler2) {
    for (const result of checkOptionalParameter(path) || [path]) this.#node.insert(method, result, handler2);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono3 = class extends Hono {
  /**
  * Creates an instance of the Hono class.
  *
  * @param options - Optional configuration options for the Hono instance.
  */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({ routers: [new RegExpRouter(), new TrieRouter()] });
  }
};

// node_modules/hono/dist/helper/adapter/index.js
var env = (c, runtime) => {
  const globalEnv = globalThis?.process?.env;
  runtime ??= getRuntimeKey();
  return {
    bun: () => globalEnv,
    node: () => globalEnv,
    "edge-light": () => globalEnv,
    deno: () => {
      return Deno.env.toObject();
    },
    workerd: () => c.env,
    fastly: () => ({}),
    other: () => ({})
  }[runtime]();
};
var knownUserAgents = {
  deno: "Deno",
  bun: "Bun",
  workerd: "Cloudflare-Workers",
  node: "Node.js"
};
var getRuntimeKey = () => {
  const global = globalThis;
  if (typeof navigator !== "undefined" && typeof navigator.userAgent === "string") {
    for (const [runtimeKey, userAgent] of Object.entries(knownUserAgents)) if (checkUserAgentEquals(userAgent)) return runtimeKey;
  }
  if (typeof global?.EdgeRuntime === "string") return "edge-light";
  if (global?.fastly !== void 0) return "fastly";
  if (global?.process?.release?.name === "node") return "node";
  return "other";
};
var checkUserAgentEquals = (platform) => {
  return navigator.userAgent.startsWith(platform);
};

// src/lib/env.ts
function getEnv(c) {
  return env(c);
}
function siteOrigin(c) {
  const configured = getEnv(c).PUBLIC_SITE_URL;
  return String(configured || new URL(c.req.url).origin).trim().replace(/\/+$/, "");
}

// src/lib/security.ts
var CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
  "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests"
].join("; ");
var securityHeaders = async (c, next) => {
  c.header("x-content-type-options", "nosniff");
  c.header("referrer-policy", "strict-origin-when-cross-origin");
  c.header("permissions-policy", "camera=(), microphone=(), geolocation=()");
  c.header("x-frame-options", "SAMEORIGIN");
  c.header("content-security-policy", CSP);
  await next();
};
var requireSameOrigin = async (c, next) => {
  const originHeader = c.req.header("Origin");
  if (originHeader && originHeader !== c.get("origin")) {
    return c.json({ error: "Origine non autoris\xE9e." }, 403);
  }
  await next();
};

// src/lib/rate-limit.ts
var windows = /* @__PURE__ */ new Map();
function clientKey(c) {
  return c.req.header("CF-Connecting-IP") || c.req.header("x-forwarded-for")?.split(",")[0]?.trim() || c.req.header("x-real-ip") || "unknown";
}
function rateLimit(max = 8, windowMs = 6e4) {
  return async (c, next) => {
    const now = Date.now();
    const key = clientKey(c);
    if (windows.size > 1e4) {
      for (const [k, v] of windows) {
        if (now - v.startedAt >= windowMs) windows.delete(k);
      }
    }
    const current = windows.get(key);
    if (!current || now - current.startedAt >= windowMs) {
      windows.set(key, { startedAt: now, count: 1 });
    } else {
      current.count += 1;
      if (current.count > max) {
        c.header("retry-after", String(Math.ceil(windowMs / 1e3)));
        return c.json({ error: "Trop de demandes. R\xE9essayez plus tard." }, 429);
      }
    }
    await next();
  };
}

// src/config/site.ts
var SITE = {
  name: "Wicka Assistance",
  tagline: "Assistance Maroc",
  phone: "+212 7 89 09 54 98",
  phoneRaw: "212789095498",
  email: "wickaassistance@gmail.com",
  logo: "/assets/images/logo.png",
  ogImage: "/assets/images/og-share.jpg",
  locale: "fr_FR",
  themeColor: "#9f1239",
  /** Année affichée dans le copyright du footer (valeur fixe, comme sur le site d'origine). */
  copyrightYear: 2026,
  defaultKeywords: "\xE9tudier au Maroc, admission Maroc, orientation \xE9tudiant, visa \xE9tudiant Maroc, \xE9tudes sup\xE9rieures Maroc, accompagnement \xE9tudiant, Wicka Assistance",
  offices: [
    { city: "Casablanca", address: "Bd d'Anfa, Maarif" },
    { city: "Rabat", address: "Avenue de France, Agdal" }
  ],
  promo: {
    tag: "\u{1F525} PROMO -50%",
    text: "\u{1F4E2} Offre de lancement Rentr\xE9e 2026-2027 : packs d'admission \xE0 prix cass\xE9s \u2014 places & tarifs limit\xE9s !",
    stickyLabel: "Postuler (Promo \u221250%)",
    // Date de fin du compte à rebours (format ISO). À mettre à jour pour prolonger la promo.
    deadline: "2026-09-30T23:59:59"
  }
};
function waLink(text2) {
  const base = `https://wa.me/${SITE.phoneRaw}`;
  return text2 ? `${base}?text=${encodeURIComponent(text2)}` : base;
}
var NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Espace Parents", href: "/#parents" },
  { label: "Universit\xE9s", href: "/universites" },
  { label: "Tarifs par Pays", href: "/tarifs" },
  { label: "Simulateur de Budget", href: "/tarifs#simulateur" },
  { label: "Packs & Navette", href: "/tarifs#packs" },
  { label: "Avis", href: "/#avis" },
  { label: "FAQ", href: "/#faq" }
];
var FOOTER_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Espace Parents", href: "/#parents" },
  { label: "Universit\xE9s Priv\xE9es", href: "/universites" },
  { label: "Tarifs par Pays", href: "/tarifs" },
  { label: "Packs & Navette A\xE9roport", href: "/tarifs#packs" },
  { label: "Avis & T\xE9moignages", href: "/#avis" },
  { label: "Contact", href: "/contact" },
  { label: "Mentions l\xE9gales", href: "/mentions-legales" },
  { label: "Politique de confidentialit\xE9", href: "/politique-confidentialite" },
  { label: "CGV", href: "/cgv" }
];
var FOOTER_SCHOOLS = [
  { label: "UEMF Euromed F\xE8s", href: "/universites" },
  { label: "ESTEM Casablanca", href: "/universites" },
  { label: "UIASS Sant\xE9 Rabat", href: "/universites" },
  { label: "ESCA Management CFC", href: "/universites" },
  { label: "EMSI Maroc (Honoris)", href: "/universites" },
  { label: "UIR Rabat & UM6P", href: "/universites" }
];
var SOCIAL_LINKS = [
  { label: "Facebook", icon: "fab fa-facebook-f", href: "#" },
  { label: "Instagram", icon: "fab fa-instagram", href: "#" },
  { label: "LinkedIn", icon: "fab fa-linkedin-in", href: "#" }
];

// node_modules/hono/dist/jsx/utils.js
var normalizeElementKeyMap = /* @__PURE__ */ new Map([
  ["className", "class"],
  ["htmlFor", "for"],
  ["crossOrigin", "crossorigin"],
  ["httpEquiv", "http-equiv"],
  ["itemProp", "itemprop"],
  ["fetchPriority", "fetchpriority"],
  ["noModule", "nomodule"],
  ["formAction", "formaction"]
]);
var normalizeIntrinsicElementKey = (key) => normalizeElementKeyMap.get(key) || key;
var invalidAttributeNameCharRe = /[\s"'<>/=`\\\x00-\x1f\x7f-\x9f]/;
var validAttributeNameCache = /* @__PURE__ */ new Set();
var validAttributeNameCacheMax = 1024;
var invalidTagNameCharRe = /^[!?]|[\s"'<>/=`\\\x00-\x1f\x7f-\x9f]/;
var validTagNameCache = /* @__PURE__ */ new Set();
var validTagNameCacheMax = 256;
var cacheValidName = (cache, max, name) => {
  if (cache.size >= max) cache.clear();
  cache.add(name);
};
var isValidTagName = (name) => {
  if (validTagNameCache.has(name)) return true;
  if (typeof name !== "string") return false;
  if (name.length === 0) return true;
  if (invalidTagNameCharRe.test(name)) return false;
  cacheValidName(validTagNameCache, validTagNameCacheMax, name);
  return true;
};
var isValidAttributeName = (name) => {
  if (validAttributeNameCache.has(name)) return true;
  const len = name.length;
  if (len === 0) return false;
  for (let i = 0; i < len; i++) {
    const c = name.charCodeAt(i);
    if (!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c === 45 || c === 95 || c === 46 || c === 58)) {
      if (!invalidAttributeNameCharRe.test(name)) {
        cacheValidName(validAttributeNameCache, validAttributeNameCacheMax, name);
        return true;
      } else return false;
    }
  }
  cacheValidName(validAttributeNameCache, validAttributeNameCacheMax, name);
  return true;
};
var invalidStylePropertyNameCharRe = /[\s"'():;\\/\[\]{}\x00-\x1f\x7f-\x9f]/;
var validStylePropertyNameCache = /* @__PURE__ */ new Set();
var validStylePropertyNameCacheMax = 1024;
var isValidStylePropertyName = (name) => {
  if (validStylePropertyNameCache.has(name)) return true;
  const len = name.length;
  if (len === 0) return false;
  for (let i = 0; i < len; i++) {
    const c = name.charCodeAt(i);
    if (!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c === 45 || c === 95)) {
      if (!invalidStylePropertyNameCharRe.test(name)) {
        cacheValidName(validStylePropertyNameCache, validStylePropertyNameCacheMax, name);
        return true;
      } else return false;
    }
  }
  cacheValidName(validStylePropertyNameCache, validStylePropertyNameCacheMax, name);
  return true;
};
var unsafeStyleValueCharRe = /[;"'\\/\[\](){}]/;
var hasUnsafeStyleValue = (value) => {
  if (!unsafeStyleValueCharRe.test(value)) return false;
  let quote = 0;
  const blockStack = [];
  for (let i = 0, len = value.length; i < len; i++) {
    const c = value.charCodeAt(i);
    if (c === 92) {
      if (i === len - 1) return true;
      i++;
    } else if (quote !== 0) {
      if (c === 10 || c === 12 || c === 13) return true;
      if (c === quote) quote = 0;
    } else if (c === 47 && value.charCodeAt(i + 1) === 42) {
      const end = value.indexOf("*/", i + 2);
      if (end === -1) return true;
      i = end + 1;
    } else if (c === 34 || c === 39) quote = c;
    else if (c === 40) blockStack.push(41);
    else if (c === 91) blockStack.push(93);
    else if (c === 123 || c === 125) return true;
    else if (c === 41 || c === 93) {
      if (blockStack[blockStack.length - 1] !== c) return true;
      blockStack.pop();
    } else if (c === 59 && blockStack.length === 0) return true;
  }
  return quote !== 0 || blockStack.length !== 0;
};
var styleObjectForEach = (style2, fn) => {
  for (const [k, v] of Object.entries(style2)) {
    const key = k[0] === "-" || !/[A-Z]/.test(k) ? k : k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    if (!isValidStylePropertyName(key)) continue;
    if (v == null) {
      fn(key, null);
      continue;
    }
    let value;
    if (typeof v === "number") value = !key.match(/^(?:a|border-im|column(?:-c|s)|flex(?:$|-[^b])|grid-(?!.*gap)(?:ar|[^a])|font-w|li|or|sca|st|ta|wido|z)|ty$/) ? `${v}px` : `${v}`;
    else if (typeof v === "string") {
      if (hasUnsafeStyleValue(v)) continue;
      value = v;
    } else continue;
    fn(key, value);
  }
};

// node_modules/hono/dist/jsx/constants.js
var DOM_RENDERER = /* @__PURE__ */ Symbol("RENDERER");
var DOM_ERROR_HANDLER = /* @__PURE__ */ Symbol("ERROR_HANDLER");
var DOM_INTERNAL_TAG = /* @__PURE__ */ Symbol("INTERNAL");
var PERMALINK = /* @__PURE__ */ Symbol("PERMALINK");

// node_modules/hono/dist/jsx/dom/utils.js
var setInternalTagFlag = (fn) => {
  fn[DOM_INTERNAL_TAG] = true;
  return fn;
};

// node_modules/hono/dist/jsx/dom/context.js
var createContextProviderFunction = (values2) => ({ value, children }) => {
  if (!children) return;
  const props = { children: [{
    tag: setInternalTagFlag(() => {
      values2.push(value);
    }),
    props: {}
  }] };
  if (Array.isArray(children)) props.children.push(...children.flat());
  else props.children.push(children);
  props.children.push({
    tag: setInternalTagFlag(() => {
      values2.pop();
    }),
    props: {}
  });
  const res = {
    tag: "",
    props,
    type: ""
  };
  res[DOM_ERROR_HANDLER] = (err) => {
    values2.pop();
    throw err;
  };
  return res;
};

// node_modules/hono/dist/jsx/context.js
var globalContexts = [];
var alsProbed = false;
var asyncLocalStorage;
var fallbackStore;
var fallbackRendersInFlight = 0;
var warnedFallbackDefault = false;
var loadAsyncLocalStorage = () => {
  if (alsProbed) return asyncLocalStorage;
  alsProbed = true;
  const global = globalThis;
  let AsyncLocalStorage;
  for (const probe of [() => global.process?.getBuiltinModule?.("node:async_hooks")?.AsyncLocalStorage, () => global.process?.mainModule?.require?.("node:async_hooks")?.AsyncLocalStorage]) {
    try {
      AsyncLocalStorage = probe();
    } catch {
    }
    if (AsyncLocalStorage) break;
  }
  if (AsyncLocalStorage) asyncLocalStorage = new AsyncLocalStorage();
  return asyncLocalStorage;
};
var getCurrentStore = () => {
  return loadAsyncLocalStorage()?.getStore() || fallbackStore;
};
var warnIfStorelessAccess = () => {
  if (fallbackRendersInFlight > 0 && !warnedFallbackDefault) {
    warnedFallbackDefault = true;
    console.warn("hono/jsx: AsyncLocalStorage is unavailable in this runtime, so useContext() after an await in an async component falls back to the context default value during server-side rendering. To get provided values across await boundaries, use a runtime with AsyncLocalStorage (Node.js >= 20.16, Deno, Bun, or Cloudflare Workers with the nodejs_compat flag).");
  }
};
var getContextValuesIn = (store, context) => {
  if (!store) {
    warnIfStorelessAccess();
    return context.values;
  }
  let values2 = store.get(context);
  if (!values2) {
    values2 = [context.values[0]];
    store.set(context, values2);
  }
  return values2;
};
var readContextValueIn = (store, context) => {
  if (!store) {
    warnIfStorelessAccess();
    return context.values.at(-1);
  }
  const values2 = store.get(context);
  return values2?.length ? values2.at(-1) : context.values[0];
};
var captureContextValues = (store) => (store ? globalContexts.filter((c) => store.has(c)) : globalContexts).map((c) => [c, readContextValueIn(store, c)]);
var resumeWithContextValues = (callback, store, contexts) => runWithRenderContext(() => {
  const currentStore = getCurrentStore();
  const valuesPerContext = contexts.map(([context, value]) => {
    const values2 = getContextValuesIn(currentStore, context);
    values2.push(value);
    return values2;
  });
  const popContextValues = () => {
    valuesPerContext.forEach((values2) => {
      values2.pop();
    });
  };
  try {
    const result = callback();
    if (result instanceof Promise) return result.finally(popContextValues);
    popContextValues();
    return result;
  } catch (e) {
    popContextValues();
    throw e;
  }
}, store);
var runWithRenderContext = (callback, resumeStore) => {
  if (getCurrentStore()) return callback();
  const store = resumeStore ?? /* @__PURE__ */ new WeakMap();
  const storage = loadAsyncLocalStorage();
  if (storage) return storage.run(store, callback);
  fallbackStore = store;
  let result;
  try {
    result = callback();
  } finally {
    fallbackStore = void 0;
  }
  if (!warnedFallbackDefault && result instanceof Promise) {
    fallbackRendersInFlight++;
    result = result.finally(() => {
      fallbackRendersInFlight--;
    });
  }
  return result;
};
var captureRenderContext = () => {
  const store = getCurrentStore();
  const contexts = captureContextValues(store);
  return (callback) => resumeWithContextValues(callback, store, contexts);
};
var createContext = (defaultValue) => {
  const values2 = [defaultValue];
  const context = ((props) => {
    const contextValues = getContextValuesIn(getCurrentStore(), context);
    contextValues.push(props.value);
    let rendered;
    try {
      rendered = typeof props.children === "string" ? renderChildren([props.children]) : isUntrustedObject(props.children) ? renderUntrustedObject(props.children) : props.children ? (Array.isArray(props.children) ? new JSXFragmentNode("", {}, props.children) : props.children).toString() : raw("");
    } catch (e) {
      contextValues.pop();
      throw e;
    }
    if (rendered instanceof Promise) return rendered.finally(() => contextValues.pop()).then((resString) => raw(resString, resString.callbacks));
    else {
      contextValues.pop();
      return raw(rendered);
    }
  });
  context.values = values2;
  context.Provider = context;
  context[DOM_RENDERER] = createContextProviderFunction(values2);
  globalContexts.push(context);
  return context;
};
var useContext = (context) => {
  return readContextValueIn(getCurrentStore(), context);
};

// node_modules/hono/dist/jsx/intrinsic-element/common.js
var deDupeKeyMap = {
  title: [],
  script: ["src"],
  style: ["data-href"],
  link: ["href"],
  meta: [
    "name",
    "httpEquiv",
    "charset",
    "itemProp"
  ]
};
var domRenderers = {};
var dataPrecedenceAttr = "data-precedence";
var isStylesheetLinkWithPrecedence = (props) => props.rel === "stylesheet" && "precedence" in props;
var shouldDeDupeByKey = (tagName, supportSort) => {
  if (tagName === "link") return supportSort;
  return deDupeKeyMap[tagName].length > 0;
};

// node_modules/hono/dist/_virtual/_rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
  let target = {};
  for (var name in all) __defProp(target, name, {
    get: all[name],
    enumerable: true
  });
  if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
  return target;
};

// node_modules/hono/dist/jsx/children.js
var toArray = (children) => Array.isArray(children) ? children : [children];

// node_modules/hono/dist/jsx/intrinsic-element/components.js
var components_exports = /* @__PURE__ */ __exportAll({
  button: () => button,
  form: () => form,
  input: () => input,
  link: () => link,
  meta: () => meta,
  script: () => script,
  style: () => style,
  title: () => title
});
var metaTagMap = /* @__PURE__ */ new WeakMap();
var insertIntoHead = (tagName, tag, props, precedence) => ({ buffer, context }) => {
  if (!buffer) return;
  const map = metaTagMap.get(context) || {};
  metaTagMap.set(context, map);
  const tags = map[tagName] ||= [];
  let duped = false;
  const deDupeKeys = deDupeKeyMap[tagName];
  const deDupeByKey = shouldDeDupeByKey(tagName, precedence !== void 0);
  if (deDupeByKey) LOOP: for (const [, tagProps] of tags) {
    if (tagName === "link" && !(tagProps.rel === "stylesheet" && tagProps["data-precedence"] !== void 0)) continue;
    for (const key of deDupeKeys) if ((tagProps?.[key] ?? null) === props?.[key]) {
      duped = true;
      break LOOP;
    }
  }
  if (duped) buffer[0] = buffer[0].replaceAll(tag, "");
  else if (deDupeByKey || tagName === "link") tags.push([
    tag,
    props,
    precedence
  ]);
  else tags.unshift([
    tag,
    props,
    precedence
  ]);
  if (buffer[0].indexOf("</head>") !== -1) {
    let insertTags;
    if (tagName === "link" || precedence !== void 0) {
      const precedences = [];
      insertTags = tags.map(([tag2, , tagPrecedence], index) => {
        if (tagPrecedence === void 0) return [
          tag2,
          Number.MAX_SAFE_INTEGER,
          index
        ];
        let order2 = precedences.indexOf(tagPrecedence);
        if (order2 === -1) {
          precedences.push(tagPrecedence);
          order2 = precedences.length - 1;
        }
        return [
          tag2,
          order2,
          index
        ];
      }).sort((a, b) => a[1] - b[1] || a[2] - b[2]).map(([tag2]) => tag2);
    } else insertTags = tags.map(([tag2]) => tag2);
    insertTags.forEach((tag2) => {
      buffer[0] = buffer[0].replaceAll(tag2, "");
    });
    buffer[0] = buffer[0].replace(/(?=<\/head>)/, () => insertTags.join(""));
  }
};
var returnWithoutSpecialBehavior = (tag, children, props) => renderChildren([new JSXNode(tag, props, toArray(children ?? []))]);
var documentMetadataTag = (tag, children, props, sort) => {
  if ("itemProp" in props) return returnWithoutSpecialBehavior(tag, children, props);
  let { precedence, blocking, ...restProps } = props;
  precedence = sort ? precedence ?? "" : void 0;
  if (sort) restProps[dataPrecedenceAttr] = precedence;
  const string = new JSXNode(tag, restProps, toArray(children || [])).toString();
  if (string instanceof Promise) return string.then((resString) => raw(resString, [...resString.callbacks || [], insertIntoHead(tag, resString, restProps, precedence)]));
  else return raw(string, [insertIntoHead(tag, string, restProps, precedence)]);
};
var title = ({ children, ...props }) => {
  const nameSpaceContext2 = getNameSpaceContext();
  if (nameSpaceContext2) {
    const context = useContext(nameSpaceContext2);
    if (context === "svg" || context === "head") return new JSXNode("title", props, toArray(children ?? []));
  }
  return documentMetadataTag("title", children, props, false);
};
var script = ({ children, ...props }) => {
  const nameSpaceContext2 = getNameSpaceContext();
  if (["src", "async"].some((k) => !props[k]) || nameSpaceContext2 && useContext(nameSpaceContext2) === "head") return returnWithoutSpecialBehavior("script", children, props);
  return documentMetadataTag("script", children, props, false);
};
var style = ({ children, ...props }) => {
  if (!["href", "precedence"].every((k) => k in props)) return returnWithoutSpecialBehavior("style", children, props);
  props["data-href"] = props.href;
  delete props.href;
  return documentMetadataTag("style", children, props, true);
};
var link = ({ children, ...props }) => {
  if (["onLoad", "onError"].some((k) => k in props) || props.rel === "stylesheet" && (!("precedence" in props) || "disabled" in props)) return returnWithoutSpecialBehavior("link", children, props);
  return documentMetadataTag("link", children, props, isStylesheetLinkWithPrecedence(props));
};
var meta = ({ children, ...props }) => {
  const nameSpaceContext2 = getNameSpaceContext();
  if (nameSpaceContext2 && useContext(nameSpaceContext2) === "head") return returnWithoutSpecialBehavior("meta", children, props);
  return documentMetadataTag("meta", children, props, false);
};
var newJSXNode = (tag, { children, ...props }) => new JSXNode(tag, props, toArray(children ?? []));
var form = (props) => {
  if (typeof props.action === "function") props.action = PERMALINK in props.action ? props.action[PERMALINK] : void 0;
  return newJSXNode("form", props);
};
var formActionableElement = (tag, props) => {
  if (typeof props.formAction === "function") props.formAction = PERMALINK in props.formAction ? props.formAction[PERMALINK] : void 0;
  return newJSXNode(tag, props);
};
var input = (props) => formActionableElement("input", props);
var button = (props) => formActionableElement("button", props);

// node_modules/hono/dist/jsx/base.js
var nameSpaceContext = void 0;
var getNameSpaceContext = () => nameSpaceContext;
var toSVGAttributeName = (key) => /[A-Z]/.test(key) && key.match(/^(?:al|basel|clip(?:Path|Rule)$|co|do|fill|fl|fo|gl|let|lig|i|marker[EMS]|o|pai|pointe|sh|st[or]|text[^L]|tr|u|ve|w)/) ? key.replace(/([A-Z])/g, "-$1").toLowerCase() : key;
var emptyTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
var booleanAttributes = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "download",
  "formnovalidate",
  "hidden",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
];
var resolveFunctionComponentResult = (result, suspendedContext) => result.then((resolved) => {
  if (typeof resolved !== "string" && !Array.isArray(resolved) && !(resolved instanceof JSXNode)) return resolved;
  const children = Array.isArray(resolved) ? resolved : [resolved];
  const render = () => {
    const buffer = [""];
    childrenToStringToBuffer(children, buffer);
    return buffer.length === 1 ? raw(buffer[0], buffer.callbacks) : stringBufferToString(buffer, buffer.callbacks);
  };
  return suspendedContext ? suspendedContext(render) : runWithRenderContext(render);
});
var childrenToStringToBuffer = (children, buffer) => {
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];
    if (typeof child === "string") escapeToBuffer(child, buffer);
    else if (typeof child === "boolean" || child === null || child === void 0) continue;
    else if (child instanceof JSXNode) child.toStringToBuffer(buffer);
    else if (typeof child === "number") buffer[0] += child;
    else if (child.isEscaped) {
      buffer[0] += child;
      const callbacks = child.callbacks;
      if (callbacks) {
        buffer.callbacks ||= [];
        buffer.callbacks.push(...callbacks);
      }
    } else if (child instanceof Promise) buffer.unshift("", child);
    else childrenToStringToBuffer(child, buffer);
  }
};
var renderChildren = (children) => runWithRenderContext(() => {
  const buffer = [""];
  childrenToStringToBuffer(children, buffer);
  return buffer.length === 1 ? raw(buffer[0], buffer.callbacks) : stringBufferToString(buffer, buffer.callbacks);
});
var isUntrustedObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof JSXNode) && !(value instanceof Promise) && !value.isEscaped && typeof value.toString === "function";
var renderUntrustedObject = (value) => {
  const stringified = value.toString();
  const escape = (result) => renderChildren([String(result)]);
  return stringified instanceof Promise ? stringified.then(escape) : escape(stringified);
};
var JSXNode = class {
  tag;
  props;
  key;
  children;
  isEscaped = true;
  constructor(tag, props, children) {
    if (typeof tag !== "function" && !isValidTagName(tag)) throw new Error(`Invalid JSX tag name: ${tag}`);
    this.tag = tag;
    this.props = props;
    this.children = children;
  }
  get type() {
    return this.tag;
  }
  get ref() {
    return this.props.ref || null;
  }
  toString() {
    const render = () => {
      const buffer = [""];
      this.toStringToBuffer(buffer);
      return buffer.length === 1 ? "callbacks" in buffer ? resolveCallbackSync(raw(buffer[0], buffer.callbacks)).toString() : buffer[0] : stringBufferToString(buffer, buffer.callbacks);
    };
    return runWithRenderContext(render);
  }
  toStringToBuffer(buffer) {
    const tag = this.tag;
    const props = this.props;
    let { children } = this;
    buffer[0] += `<${tag}`;
    const normalizeKey = tag === "svg" || nameSpaceContext && useContext(nameSpaceContext) === "svg" ? (key) => toSVGAttributeName(normalizeIntrinsicElementKey(key)) : (key) => normalizeIntrinsicElementKey(key);
    for (let [key, v] of Object.entries(props)) {
      key = normalizeKey(key);
      if (!isValidAttributeName(key)) continue;
      if (key === "children") {
      } else if (key === "style" && typeof v === "object") {
        let styleStr = "";
        styleObjectForEach(v, (property, value) => {
          if (value != null) styleStr += `${styleStr ? ";" : ""}${property}:${value}`;
        });
        buffer[0] += ' style="';
        escapeToBuffer(styleStr, buffer);
        buffer[0] += '"';
      } else if (typeof v === "string") {
        buffer[0] += ` ${key}="`;
        escapeToBuffer(v, buffer);
        buffer[0] += '"';
      } else if (v === null || v === void 0) {
      } else if (typeof v === "number" || v.isEscaped) buffer[0] += ` ${key}="${v}"`;
      else if (typeof v === "boolean" && booleanAttributes.includes(key)) {
        if (v) buffer[0] += ` ${key}=""`;
      } else if (key === "dangerouslySetInnerHTML") {
        if (children.length > 0) throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
        children = [raw(v.__html)];
      } else if (v instanceof Promise) {
        buffer[0] += ` ${key}="`;
        buffer.unshift('"', v);
      } else if (typeof v === "function") {
        if (!key.startsWith("on") && key !== "ref") throw new Error(`Invalid prop '${key}' of type 'function' supplied to '${tag}'.`);
      } else {
        buffer[0] += ` ${key}="`;
        escapeToBuffer(v.toString(), buffer);
        buffer[0] += '"';
      }
    }
    if (emptyTags.includes(tag) && children.length === 0) {
      buffer[0] += "/>";
      return;
    }
    buffer[0] += ">";
    childrenToStringToBuffer(children, buffer);
    buffer[0] += `</${tag}>`;
  }
};
var JSXFunctionNode = class extends JSXNode {
  toStringToBuffer(buffer) {
    const { children } = this;
    const props = { ...this.props };
    if (children.length) props.children = children.length === 1 ? children[0] : children;
    const res = this.tag.call(null, props);
    if (typeof res === "boolean" || res == null) return;
    else if (res instanceof Promise) {
      if (globalContexts.length === 0) buffer.unshift("", resolveFunctionComponentResult(res));
      else buffer.unshift("", resolveFunctionComponentResult(res, captureRenderContext()));
    } else if (res instanceof JSXNode) res.toStringToBuffer(buffer);
    else if (Array.isArray(res)) childrenToStringToBuffer(res, buffer);
    else if (typeof res === "number" || res.isEscaped) {
      buffer[0] += res;
      if (res.callbacks) {
        buffer.callbacks ||= [];
        buffer.callbacks.push(...res.callbacks);
      }
    } else escapeToBuffer(res, buffer);
  }
};
var JSXFragmentNode = class extends JSXNode {
  toStringToBuffer(buffer) {
    childrenToStringToBuffer(this.children, buffer);
  }
};
var initDomRenderer = false;
var jsxFn = (tag, props, children) => {
  if (!initDomRenderer) {
    for (const k in domRenderers) components_exports[k][DOM_RENDERER] = domRenderers[k];
    initDomRenderer = true;
  }
  if (typeof tag === "function") return new JSXFunctionNode(tag, props, children);
  else if (components_exports[tag]) return new JSXFunctionNode(components_exports[tag], props, children);
  else if (tag === "svg" || tag === "head") {
    nameSpaceContext ||= createContext("");
    return new JSXNode(tag, props, [new JSXFunctionNode(nameSpaceContext, { value: tag }, children)]);
  } else return new JSXNode(tag, props, children);
};
var Fragment = ({ children }) => {
  return new JSXFragmentNode("", { children }, Array.isArray(children) ? children : children ? [children] : []);
};

// node_modules/hono/dist/jsx/jsx-dev-runtime.js
function jsxDEV(tag, props, key) {
  let node;
  if (!props || !("children" in props)) node = jsxFn(tag, props, []);
  else {
    const children = props.children;
    node = Array.isArray(children) ? jsxFn(tag, props, children) : jsxFn(tag, props, [children]);
  }
  node.key = key;
  return node;
}

// src/pages/Home.tsx
var homeMeta = {
  title: "\xC9tudier au Maroc | Admission, Visa & Orientation",
  description: "Pr\xE9parez vos \xE9tudes au Maroc avec un accompagnement personnalis\xE9 : orientation, admission, visa \xE9tudiant, tarifs et accueil des \xE9tudiants internationaux."
};
var advantages = [
  {
    icon: "fas fa-shield-alt",
    title: "S\xE9curit\xE9 & Stabilit\xE9 Totale",
    text: "Le Maroc b\xE9n\xE9ficie d'une stabilit\xE9 institutionnelle et d'une s\xE9curit\xE9 publique reconnues internationalement. Les \xE9tudiants y vivent et se d\xE9placent en toute tranquillit\xE9, de jour comme de nuit."
  },
  {
    icon: "fas fa-graduation-cap",
    title: "Dipl\xF4mes Reconnus & Doubles Dipl\xF4mes",
    text: "Syst\xE8me LMD (Licence, Master, Doctorat). Les grandes \xE9coles partenaires d\xE9livrent des dipl\xF4mes reconnus par l'\xC9tat marocain et des doubles dipl\xF4mes avec la France, l'Europe et les USA."
  },
  {
    icon: "fas fa-train",
    title: "Infrastructures Modernes & TGV Al Boraq",
    text: "R\xE9seaux de transports ultra modernes : TGV reliant Tanger, Rabat et Casablanca \xE0 320 km/h, lignes de tramways urbains modernes et a\xE9roports internationaux reli\xE9s \xE0 toute l'Afrique."
  },
  {
    icon: "fas fa-handshake",
    title: "Hospitalit\xE9 & Climat Ensoleill\xE9",
    text: "Une culture d'accueil chaleureuse pour plus de 25 000 \xE9tudiants internationaux africains. Aucune rupture linguistique pour les francophones et un climat ensoleill\xE9 300 jours par an."
  },
  {
    icon: "fas fa-coins",
    title: "Budget Ma\xEEtris\xE9 & 3x Moins Cher",
    text: "Une qualit\xE9 d'enseignement \xE9quivalente aux meilleures universit\xE9s europ\xE9ennes pour un co\xFBt global de scolarit\xE9 et de vie 3 \xE0 4 fois inf\xE9rieur \xE0 la France, au Canada ou aux USA."
  },
  {
    icon: "fas fa-briefcase",
    title: "Hub \xC9conomique & Stages Garantis",
    text: "V\xE9ritable carrefour \xE9conomique abritant les si\xE8ges r\xE9gionaux de multinationales en finance (Casablanca Finance City), a\xE9ronautique, intelligence artificielle et \xE9nergies renouvelables."
  }
];
var explore = [
  {
    href: "/universites",
    icon: "fas fa-university",
    title: "Universit\xE9s Priv\xE9es",
    text: "15 grandes \xE9coles reconnues par l'\xC9tat, avec photos, fili\xE8res et mini-descriptions.",
    link: "Voir les universit\xE9s"
  },
  {
    href: "/tarifs",
    icon: "fas fa-tags",
    title: "Tarifs, Simulateur & Packs",
    text: /* @__PURE__ */ jsxDEV(Fragment, { children: [
      "Tarifs par pays en ",
      /* @__PURE__ */ jsxDEV("strong", { children: "promo \u221250%" }),
      ", simulateur de budget et formules d'assistance."
    ] }),
    link: "Voir les tarifs"
  },
  {
    href: "/candidature",
    icon: "fas fa-paper-plane",
    title: "D\xE9poser ma Candidature",
    text: "Formulaire en 4 \xE9tapes. R\xE9ponse d'un conseiller sous 24h et tarif promo bloqu\xE9.",
    link: "Postuler maintenant",
    accent: true
  }
];
var steps = [
  {
    n: "01",
    title: "Bilan Scolaire Personnalis\xE9",
    text: "\xC9tude personnalis\xE9e des relev\xE9s de notes et s\xE9lection cibl\xE9e des meilleures universit\xE9s priv\xE9es (UEMF, ESTEM, UIASS, EMSI...).",
    tagIcon: "far fa-clock",
    tag: "24h - 48h"
  },
  {
    n: "02",
    title: "D\xE9p\xF4t & Suivi des Dossiers",
    text: "Constitution optimis\xE9e du dossier, lettres de motivation percutantes et soumission directe aupr\xE8s des directions des admissions.",
    tagIcon: "far fa-clock",
    tag: "3 \xE0 7 jours"
  },
  {
    n: "03",
    title: "Lettre d'Admission Officielle",
    text: "D\xE9livrance de l'attestation officielle d'admission valid\xE9e par le Minist\xE8re de l'Enseignement Sup\xE9rieur du Maroc.",
    tagIcon: "fas fa-check-circle",
    tag: "Taux 98%",
    tagClass: "text-rose"
  },
  {
    n: "04",
    title: "Visa, Carte Consulaire & Ambassade",
    text: /* @__PURE__ */ jsxDEV(Fragment, { children: [
      "Constitution du dossier de ",
      /* @__PURE__ */ jsxDEV("strong", { children: "carte consulaire" }),
      " et accompagnement jusqu'au d\xE9p\xF4t \xE0 l'",
      /* @__PURE__ */ jsxDEV("strong", { children: "ambassade / consulat du Maroc" }),
      " (prise en charge financi\xE8re, casier, attestation)."
    ] }),
    tagIcon: "fas fa-passport",
    tag: "100% Conforme"
  },
  {
    n: "05",
    title: "Navette, Installation & Carte de S\xE9jour",
    text: /* @__PURE__ */ jsxDEV(Fragment, { children: [
      "Accueil avec chauffeur priv\xE9 \xE0 l'atterrissage, transfert vers la ville d'accueil, carte SIM 4G et",
      " ",
      /* @__PURE__ */ jsxDEV("strong", { children: "prise en charge du dossier de Carte de S\xE9jour jusqu'\xE0 son obtention" }),
      "."
    ] }),
    tagIcon: "fas fa-car-side",
    tag: "S\xE9curit\xE9 VIP",
    tagClass: "text-success"
  }
];
var values = [
  {
    icon: "fas fa-user-check",
    title: "Contact Direct Parents",
    text: "Points d'\xE9tape r\xE9guliers par appel ou visio WhatsApp avec les parents."
  },
  {
    icon: "fas fa-certificate",
    title: "Partenariats Priv\xE9s Agr\xE9\xE9s",
    text: "Acc\xE8s direct aux jurys d'admission (UEMF, ESTEM, UIASS, EMSI, UIR...)."
  },
  {
    icon: "fas fa-file-contract",
    title: "Contrat & Re\xE7u Officiel",
    text: "Paiements locaux s\xE9curis\xE9s avec facture et re\xE7u officiel imm\xE9diat."
  },
  {
    icon: "fas fa-car",
    title: "Prise en Charge R\xE9elle",
    text: "Un chauffeur et un conseiller d\xE9di\xE9s d\xE8s la descente de l'avion."
  }
];
var successPhotos = [
  { src: "/assets/uni/student-grad.jpg", alt: "\xC9tudiante dipl\xF4m\xE9e au Maroc", icon: "fas fa-graduation-cap", caption: "Dipl\xF4m\xE9e & fi\xE8re" },
  { src: "/assets/uni/student-grad-2.jpg", alt: "Jeune dipl\xF4m\xE9 au Maroc", icon: "fas fa-award", caption: "Master en poche" },
  { src: "/assets/uni/student-portrait.jpg", alt: "\xC9tudiant sur son campus", icon: "fas fa-user-graduate", caption: "Sur son campus" }
];
var Home = () => /* @__PURE__ */ jsxDEV(Fragment, { children: [
  /* @__PURE__ */ jsxDEV("section", { class: "hero-section", id: "hero", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "hero-glow-circle-1" }),
    /* @__PURE__ */ jsxDEV("div", { class: "hero-glow-circle-2" }),
    /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "hero-grid", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "hero-text-content", children: [
          /* @__PURE__ */ jsxDEV("div", { class: "hero-badge-pill", children: [
            /* @__PURE__ */ jsxDEV("span", { class: "pulse-dot" }),
            /* @__PURE__ */ jsxDEV("span", { children: "Admissions Garanties dans les Meilleures Universit\xE9s Priv\xE9es du Maroc" })
          ] }),
          /* @__PURE__ */ jsxDEV("h1", { class: "hero-headline", children: [
            "S\xE9curisez les \xC9tudes de Votre Enfant dans les ",
            /* @__PURE__ */ jsxDEV("span", { class: "text-gradient-rose", children: "Grandes \xC9coles Priv\xE9es" }),
            " ",
            "du Maroc."
          ] }),
          /* @__PURE__ */ jsxDEV("p", { class: "hero-description", children: [
            "Wicka Assistance garantit l'admission de votre enfant dans des institutions prestigieuses reconnues par l'\xC9tat (",
            /* @__PURE__ */ jsxDEV("strong", { children: "UEMF Euromed F\xE8s, ESTEM Casa, UIASS, UM6P, UIR, EMSI" }),
            "), g\xE8re l'int\xE9gralit\xE9 du dossier consulaire de visa et assure le",
            " ",
            /* @__PURE__ */ jsxDEV("strong", { children: "transport s\xE9curis\xE9 avec chauffeur priv\xE9 d\xE8s la sortie de l'a\xE9roport" }),
            "."
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "hero-cta-group", children: [
            /* @__PURE__ */ jsxDEV("a", { href: "/candidature", class: "btn-primary", children: [
              /* @__PURE__ */ jsxDEV("i", { class: "fas fa-graduation-cap" }),
              /* @__PURE__ */ jsxDEV("span", { children: "D\xE9marrer la Candidature 2026-2027" })
            ] }),
            /* @__PURE__ */ jsxDEV("a", { href: waLink(), target: "_blank", rel: "noopener noreferrer", class: "btn-secondary", children: [
              /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp text-rose" }),
              /* @__PURE__ */ jsxDEV("span", { children: "WhatsApp" })
            ] })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "hero-trust-row", children: [
            /* @__PURE__ */ jsxDEV("div", { class: "trust-avatars-group", children: [
              /* @__PURE__ */ jsxDEV("img", { src: "/assets/images/student-senegal.jpg", alt: "\xC9tudiant S\xE9n\xE9gal", class: "trust-avatar" }),
              /* @__PURE__ */ jsxDEV("img", { src: "/assets/images/student-ivory-coast.jpg", alt: "\xC9tudiante C\xF4te d'Ivoire", class: "trust-avatar" }),
              /* @__PURE__ */ jsxDEV("img", { src: "/assets/images/student-cameroon.jpg", alt: "\xC9tudiant Cameroun", class: "trust-avatar" }),
              /* @__PURE__ */ jsxDEV("img", { src: "/assets/images/student-gabon.jpg", alt: "\xC9tudiante Gabon", class: "trust-avatar" })
            ] }),
            /* @__PURE__ */ jsxDEV("div", { class: "trust-text", children: [
              /* @__PURE__ */ jsxDEV("strong", { children: "+520 \xC9tudiants Plac\xE9s avec Succ\xE8s" }),
              /* @__PURE__ */ jsxDEV("span", { children: "Pl\xE9biscit\xE9 par les parents d'\xE9l\xE8ves pour son s\xE9rieux et sa transparence" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "hero-visual-wrap", children: [
          /* @__PURE__ */ jsxDEV("div", { class: "hero-main-card", children: /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: "/assets/images/hero-students.jpg",
              alt: "\xC9tudiants internationaux heureux sur les campus marocains"
            }
          ) }),
          /* @__PURE__ */ jsxDEV("div", { class: "hero-floating-card-1", children: [
            /* @__PURE__ */ jsxDEV("div", { class: "floating-icon", children: /* @__PURE__ */ jsxDEV("i", { class: "fas fa-car-side" }) }),
            /* @__PURE__ */ jsxDEV("div", { class: "floating-info", children: [
              /* @__PURE__ */ jsxDEV("h4", { children: "Navette A\xE9roport Priv\xE9e" }),
              /* @__PURE__ */ jsxDEV("p", { children: "Transfert s\xE9curis\xE9 vers votre ville" })
            ] })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "hero-floating-card-2", children: [
            /* @__PURE__ */ jsxDEV("div", { class: "floating-icon", style: "background-color: var(--gold-light); color: var(--gold);", children: /* @__PURE__ */ jsxDEV("i", { class: "fas fa-award" }) }),
            /* @__PURE__ */ jsxDEV("div", { class: "floating-info", children: [
              /* @__PURE__ */ jsxDEV("h4", { children: "Dipl\xF4mes Reconnus" }),
              /* @__PURE__ */ jsxDEV("p", { children: "\xC9quivalence d'\xC9tat & Doubles Dipl\xF4mes" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "hero-stats-bar", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "stat-item", children: [
          /* @__PURE__ */ jsxDEV("span", { class: "counter-value", "data-target": "520", "data-suffix": "+", children: "520+" }),
          /* @__PURE__ */ jsxDEV("span", { class: "stat-label", children: "\xC9tudiants Admis avec Succ\xE8s" })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "stat-item", children: [
          /* @__PURE__ */ jsxDEV("span", { class: "counter-value", "data-target": "98", "data-suffix": "%", children: "98%" }),
          /* @__PURE__ */ jsxDEV("span", { class: "stat-label", children: "Taux d'Obtention de Visa" })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "stat-item", children: [
          /* @__PURE__ */ jsxDEV("span", { class: "counter-value", "data-target": "35", "data-suffix": "+", children: "35+" }),
          /* @__PURE__ */ jsxDEV("span", { class: "stat-label", children: "Universit\xE9s Priv\xE9es d'\xC9lite" })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "stat-item", children: [
          /* @__PURE__ */ jsxDEV("span", { class: "counter-value", "data-target": "100", "data-suffix": "%", children: "100%" }),
          /* @__PURE__ */ jsxDEV("span", { class: "stat-label", children: "S\xE9curit\xE9 & Prise en Charge" })
        ] })
      ] })
    ] })
  ] }),
  /* @__PURE__ */ jsxDEV("section", { class: "parents-section", id: "parents", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "parents-banner-box", children: /* @__PURE__ */ jsxDEV("div", { class: "parents-banner-grid", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "parents-banner-text", children: [
        /* @__PURE__ */ jsxDEV(
          "span",
          {
            class: "section-badge",
            style: "background-color: rgba(255, 255, 255, 0.2); color: var(--white); margin-bottom: 12px;",
            children: [
              /* @__PURE__ */ jsxDEV("i", { class: "fas fa-user-shield" }),
              " Espace Confiance Parents"
            ]
          }
        ),
        /* @__PURE__ */ jsxDEV("h3", { children: "Chers Parents : Pourquoi le Maroc est le Meilleur Choix d'Avenir pour Votre Enfant" }),
        /* @__PURE__ */ jsxDEV("p", { children: [
          "Envoyer son enfant \xE9tudier \xE0 l'\xE9tranger est une d\xE9cision majeure. Le Royaume du Maroc s'impose aujourd'hui comme le ",
          /* @__PURE__ */ jsxDEV("strong", { children: "1er p\xF4le universitaire d'excellence en Afrique" }),
          " : une stabilit\xE9 politique exemplaire, une s\xE9curit\xE9 totale, un climat bienveillant et des campus modernes accr\xE9dit\xE9s aux standards internationaux."
        ] })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "parents-contact-cta", children: [
        /* @__PURE__ */ jsxDEV("h4", { children: "Une Question pour Votre Enfant ?" }),
        /* @__PURE__ */ jsxDEV("p", { children: "\xC9changez en direct avec un conseiller senior par appel ou visio WhatsApp." }),
        /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: waLink("Bonjour Wicka Assistance, je suis un parent et je souhaite des informations pour mon enfant."),
            target: "_blank",
            rel: "noopener noreferrer",
            class: "btn-primary btn-full",
            style: "background: #25D366; border-color: #25D366;",
            children: [
              /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
              " WhatsApp"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-chart-line" }),
        " \xC9tude & Analyse"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "Les 6 Grands Atouts du Maroc pour les \xC9tudes Sup\xE9rieures" }),
      /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "Une analyse objective des opportunit\xE9s acad\xE9miques, du cadre de vie et de l'insertion professionnelle au Royaume du Maroc." })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "advantages-grid", children: advantages.map((a) => /* @__PURE__ */ jsxDEV("div", { class: "advantage-card", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "advantage-icon-wrap", children: /* @__PURE__ */ jsxDEV("i", { class: a.icon }) }),
      /* @__PURE__ */ jsxDEV("h3", { class: "advantage-title", children: a.title }),
      /* @__PURE__ */ jsxDEV("p", { class: "advantage-desc", children: a.text })
    ] })) })
  ] }) }),
  /* @__PURE__ */ jsxDEV("section", { class: "explore-section", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-compass" }),
        " Par o\xF9 commencer ?"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "Explorez nos Services" }),
      /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "D\xE9couvrez les universit\xE9s partenaires, comparez les tarifs dans votre devise, puis d\xE9posez votre candidature." })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "explore-cards", children: explore.map((e) => /* @__PURE__ */ jsxDEV("a", { href: e.href, class: e.accent ? "explore-card explore-card-accent" : "explore-card", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "explore-icon", children: /* @__PURE__ */ jsxDEV("i", { class: e.icon }) }),
      /* @__PURE__ */ jsxDEV("h3", { children: e.title }),
      /* @__PURE__ */ jsxDEV("p", { children: e.text }),
      /* @__PURE__ */ jsxDEV("span", { class: "explore-link", children: [
        e.link,
        " ",
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-right" })
      ] })
    ] })) })
  ] }) }),
  /* @__PURE__ */ jsxDEV("section", { class: "steps-section", id: "etapes", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-road" }),
        " Rigueur & Z\xE9ro Faux Pas"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "Le Parcours d'Admission en 5 \xC9tapes" }),
      /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "Un protocole transparent et \xE9prouv\xE9 pour garantir l'admission de l'\xE9tudiant et rassurer ses parents \xE0 chaque \xE9tape." })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "steps-timeline-grid", children: steps.map((s) => /* @__PURE__ */ jsxDEV("div", { class: "step-card", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("div", { class: "step-num-badge", children: s.n }),
        /* @__PURE__ */ jsxDEV("h3", { class: "step-title", children: s.title }),
        /* @__PURE__ */ jsxDEV("p", { class: "step-desc", children: s.text })
      ] }),
      /* @__PURE__ */ jsxDEV("span", { class: s.tagClass ? `step-footer-tag ${s.tagClass}` : "step-footer-tag", children: [
        /* @__PURE__ */ jsxDEV("i", { class: s.tagIcon }),
        " ",
        s.tag
      ] })
    ] })) })
  ] }) }),
  /* @__PURE__ */ jsxDEV("section", { class: "about-section", id: "apropos", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: /* @__PURE__ */ jsxDEV("div", { class: "about-grid", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "about-image-wrapper", children: [
      /* @__PURE__ */ jsxDEV(
        "img",
        {
          src: "/assets/images/about-team.jpg",
          alt: "\xC9quipe de conseillers Wicka Assistance \xE0 Casablanca",
          class: "about-main-img"
        }
      ),
      /* @__PURE__ */ jsxDEV("div", { class: "about-experience-badge", children: [
        /* @__PURE__ */ jsxDEV("span", { class: "exp-years", children: "100%" }),
        /* @__PURE__ */ jsxDEV("span", { class: "exp-text", children: "S\xE9rieux & Transparence" })
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "about-content", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-shield-alt" }),
        " \xC0 Propos de Nous"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "Une \xC9quipe Passionn\xE9e Bas\xE9e \xE0 Casablanca & Rabat" }),
      /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", style: "text-align: left; margin-bottom: 20px;", children: "Wicka Assistance est un cabinet sp\xE9cialis\xE9 dans la mobilit\xE9 universitaire et l'orientation strat\xE9gique des \xE9tudiants internationaux vers le Maroc." }),
      /* @__PURE__ */ jsxDEV("p", { style: "color: var(--slate-600); line-height: 1.7; font-size: 0.95rem;", children: "Contrairement aux d\xE9marcheurs informels, nous entretenons des liens institutionnels directs avec les directions des admissions des universit\xE9s priv\xE9es les plus renomm\xE9es. Nous assurons un suivi juridique et consulaire rigoureux pour faire de chaque projet d'\xE9tudes une r\xE9ussite \xE9clatante." }),
      /* @__PURE__ */ jsxDEV("div", { class: "about-values-list", children: values.map((v) => /* @__PURE__ */ jsxDEV("div", { class: "value-item", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "value-icon", children: /* @__PURE__ */ jsxDEV("i", { class: v.icon }) }),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h4", { children: v.title }),
          /* @__PURE__ */ jsxDEV("p", { children: v.text })
        ] })
      ] })) }),
      /* @__PURE__ */ jsxDEV("a", { href: waLink(), target: "_blank", rel: "noopener noreferrer", class: "btn-primary", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
        /* @__PURE__ */ jsxDEV("span", { children: "WhatsApp" })
      ] })
    ] })
  ] }) }) }),
  /* @__PURE__ */ jsxDEV("section", { class: "testimonials-section", id: "avis", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-star" }),
        " Retours d'Exp\xE9rience"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "Ce Que Disent les \xC9tudiants & Leurs Parents" }),
      /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "Des t\xE9moignages r\xE9els d'\xE9tudiants du S\xE9n\xE9gal, de C\xF4te d'Ivoire, du Cameroun et du Gabon admis avec succ\xE8s dans les plus grandes \xE9coles marocaines." })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "testimonials-grid", id: "testimonialsGrid" })
  ] }) }),
  /* @__PURE__ */ jsxDEV("section", { class: "success-band", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-heart" }),
        " Une nouvelle vie vous attend"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "\xC9panouissez-vous sur les campus marocains" }),
      /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: [
        "\xC9tudiants heureux, dipl\xF4m\xE9s fiers : rejoignez une communaut\xE9 de ",
        /* @__PURE__ */ jsxDEV("strong", { children: "+520 jeunes" }),
        " qui construisent leur avenir au Maroc."
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "success-photos", children: successPhotos.map((p) => /* @__PURE__ */ jsxDEV("figure", { class: "success-photo", children: [
      /* @__PURE__ */ jsxDEV("img", { src: p.src, alt: p.alt, loading: "lazy" }),
      /* @__PURE__ */ jsxDEV("figcaption", { children: [
        /* @__PURE__ */ jsxDEV("i", { class: p.icon }),
        " ",
        p.caption
      ] })
    ] })) }),
    /* @__PURE__ */ jsxDEV("div", { class: "success-cta", children: [
      /* @__PURE__ */ jsxDEV("a", { href: "/candidature", class: "btn-primary", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-paper-plane" }),
        " Je veux r\xE9ussir moi aussi"
      ] }),
      /* @__PURE__ */ jsxDEV(
        "a",
        {
          href: waLink("Bonjour Wicka, je veux r\xE9ussir mes \xE9tudes au Maroc comme vos \xE9tudiants."),
          target: "_blank",
          rel: "noopener noreferrer",
          class: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp text-rose" }),
            " En parler sur WhatsApp"
          ]
        }
      )
    ] })
  ] }) }),
  /* @__PURE__ */ jsxDEV(
    "section",
    {
      class: "cta-photo-band",
      style: "background-image: linear-gradient(115deg, rgba(76,5,25,0.92) 0%, rgba(159,18,57,0.82) 55%, rgba(190,18,60,0.7) 100%), url('/assets/uni/tanger.jpg');",
      children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: /* @__PURE__ */ jsxDEV("div", { class: "cta-photo-content", children: [
        /* @__PURE__ */ jsxDEV("span", { class: "cta-band-kicker light", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-graduation-cap" }),
          " Rentr\xE9e 2026-2027 \xB7 Il reste peu de places"
        ] }),
        /* @__PURE__ */ jsxDEV("h2", { children: "Votre avenir au Maroc commence par un simple message." }),
        /* @__PURE__ */ jsxDEV("p", { children: "Admission garantie, visa, carte consulaire jusqu'\xE0 l'ambassade, navette a\xE9roport et carte de s\xE9jour : on s'occupe de tout. Parlez \xE0 un conseiller d\xE8s maintenant." }),
        /* @__PURE__ */ jsxDEV("div", { class: "promo-countdown", id: "promoCountdown", "data-deadline": SITE.promo.deadline, children: [
          /* @__PURE__ */ jsxDEV("span", { class: "pc-label", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-hourglass-half" }),
            " Fin de la PROMO \u221250% dans :"
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "pc-units", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("strong", { id: "pcDays", children: "00" }),
              /* @__PURE__ */ jsxDEV("span", { children: "jours" })
            ] }),
            /* @__PURE__ */ jsxDEV("div", { class: "pc-sep", children: ":" }),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("strong", { id: "pcHours", children: "00" }),
              /* @__PURE__ */ jsxDEV("span", { children: "heures" })
            ] }),
            /* @__PURE__ */ jsxDEV("div", { class: "pc-sep", children: ":" }),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("strong", { id: "pcMins", children: "00" }),
              /* @__PURE__ */ jsxDEV("span", { children: "min" })
            ] }),
            /* @__PURE__ */ jsxDEV("div", { class: "pc-sep", children: ":" }),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("strong", { id: "pcSecs", children: "00" }),
              /* @__PURE__ */ jsxDEV("span", { children: "sec" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "cta-photo-actions", children: [
          /* @__PURE__ */ jsxDEV(
            "a",
            {
              href: waLink("Bonjour Wicka, je souhaite d\xE9marrer mon projet d'\xE9tudes au Maroc d\xE8s maintenant."),
              target: "_blank",
              rel: "noopener noreferrer",
              class: "btn-cta-white btn-cta-lg",
              children: [
                /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
                " Discuter avec un conseiller"
              ]
            }
          ),
          /* @__PURE__ */ jsxDEV("a", { href: "/candidature", class: "btn-cta-ghost btn-cta-lg light", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-rocket" }),
            " Je d\xE9marre ma candidature"
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "cta-photo-stats", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("strong", { children: "+520" }),
            /* @__PURE__ */ jsxDEV("span", { children: "\xE9tudiants plac\xE9s" })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("strong", { children: "98%" }),
            /* @__PURE__ */ jsxDEV("span", { children: "visa obtenu" })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("strong", { children: "24h" }),
            /* @__PURE__ */ jsxDEV("span", { children: "pour une r\xE9ponse" })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("strong", { children: "\u221250%" }),
            /* @__PURE__ */ jsxDEV("span", { children: "promo lancement" })
          ] })
        ] })
      ] }) })
    }
  ),
  /* @__PURE__ */ jsxDEV("section", { class: "faq-section", id: "faq", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-question-circle" }),
        " Questions Cl\xE9s"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "Foire Aux Questions Parents & Candidats" }),
      /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "Tout savoir sur les admissions en universit\xE9s priv\xE9es, les visas, le transport s\xE9curis\xE9 et le co\xFBt de la vie au Maroc." })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "faq-search-wrap", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-search" }),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          type: "text",
          id: "faqSearchInput",
          placeholder: "Rechercher une question (Euromed, navette a\xE9roport, paiement Wave, visa...)"
        }
      )
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "faq-accordion-wrap", id: "faqAccordionContainer" }),
    /* @__PURE__ */ jsxDEV("div", { class: "faq-cta-box", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h3", { children: "Une autre question ? Un conseiller vous r\xE9pond en quelques minutes." }),
        /* @__PURE__ */ jsxDEV("p", { children: "Ne restez pas dans le doute : profitez de la promo \u221250% avant la fin du compte \xE0 rebours." })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "faq-cta-actions", children: [
        /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: waLink("Bonjour Wicka, j'ai une question avant de souscrire."),
            target: "_blank",
            rel: "noopener noreferrer",
            class: "btn-cta-white",
            children: [
              /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
              " Poser ma question sur WhatsApp"
            ]
          }
        ),
        /* @__PURE__ */ jsxDEV("a", { href: "/candidature", class: "btn-cta-ghost", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-paper-plane" }),
          " Postuler maintenant"
        ] })
      ] })
    ] })
  ] }) })
] });

// src/pages/Candidature.tsx
var candidatureMeta = {
  title: "Candidature pour \xE9tudier au Maroc | Wicka Assistance",
  description: "D\xE9posez votre candidature pour \xE9tudier au Maroc et recevez une orientation personnalis\xE9e, une estimation des d\xE9marches et un suivi par un conseiller.",
  keywords: "candidature \xE9tudes Maroc, admission \xE9tudiant Maroc, dossier \xE9tudiant international, orientation post-bac Maroc, visa \xE9tudiant, accompagnement admission, Wicka Assistance"
};
var Candidature = () => /* @__PURE__ */ jsxDEV("section", { class: "application-section", id: "candidature", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
  /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
    /* @__PURE__ */ jsxDEV("span", { class: "section-badge", style: "background-color: rgba(225, 29, 72, 0.2); color: var(--rose-300);", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-paper-plane" }),
      " Session d'Admission 2026-2027"
    ] }),
    /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "Formulaire de Candidature Officiel" }),
    /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "Remplissez ce formulaire pour recevoir l'\xE9valuation de votre dossier et votre devis dans votre monnaie locale." })
  ] }),
  /* @__PURE__ */ jsxDEV("div", { class: "apply-reassure", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "apply-reassure-photo", children: [
      /* @__PURE__ */ jsxDEV(
        "img",
        {
          src: "/assets/uni/student-grad.jpg",
          alt: "\xC9tudiante dipl\xF4m\xE9e accompagn\xE9e par Wicka Assistance",
          loading: "lazy"
        }
      ),
      /* @__PURE__ */ jsxDEV("span", { class: "apply-reassure-badge", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-circle-check" }),
        " Admission confirm\xE9e"
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "apply-reassure-text", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge", style: "margin-bottom: 12px;", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-user-graduate" }),
        " Ils l'ont fait avant vous"
      ] }),
      /* @__PURE__ */ jsxDEV("h3", { children: "Vous aussi, r\xE9ussissez votre projet d'\xE9tudes au Maroc." }),
      /* @__PURE__ */ jsxDEV("p", { children: [
        "Rejoignez les ",
        /* @__PURE__ */ jsxDEV("strong", { children: "+520 \xE9tudiants d\xE9j\xE0 plac\xE9s" }),
        " dans les meilleures universit\xE9s priv\xE9es du Maroc. Remplissez le formulaire ci-dessous : un conseiller vous r\xE9pond en 24h et bloque votre tarif promo."
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "apply-reassure-chips", children: [
        /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-user-graduate" }),
          " +520 \xE9tudiants plac\xE9s"
        ] }),
        /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-passport" }),
          " 98% de visa obtenu"
        ] }),
        /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-car-side" }),
          " Navette a\xE9roport incluse"
        ] })
      ] })
    ] })
  ] }),
  /* @__PURE__ */ jsxDEV("div", { class: "app-form-box", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "form-step-indicators", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "form-progress-track", children: /* @__PURE__ */ jsxDEV("div", { class: "form-progress-bar", id: "formProgressBar" }) }),
      /* @__PURE__ */ jsxDEV("div", { class: "step-indicator-item active", "data-step": "1", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "step-indicator-circle", children: "1" }),
        /* @__PURE__ */ jsxDEV("span", { class: "step-indicator-label", children: "Profil Scolaire" })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "step-indicator-item", "data-step": "2", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "step-indicator-circle", children: "2" }),
        /* @__PURE__ */ jsxDEV("span", { class: "step-indicator-label", children: "Projet Maroc" })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "step-indicator-item", "data-step": "3", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "step-indicator-circle", children: "3" }),
        /* @__PURE__ */ jsxDEV("span", { class: "step-indicator-label", children: "Formule & Navette" })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "step-indicator-item", "data-step": "4", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "step-indicator-circle", children: "4" }),
        /* @__PURE__ */ jsxDEV("span", { class: "step-indicator-label", children: "Coordonn\xE9es" })
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("form", { id: "multiStepApplicationForm", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "form-step-panel active", "data-step": "1", children: [
        /* @__PURE__ */ jsxDEV("h3", { class: "panel-heading", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-user-graduate text-rose" }),
          " \xC9tape 1 : Profil Scolaire de l'\xC9tudiant"
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "form-row-2", children: [
          /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "formFullName", children: "Nom & Pr\xE9nom de l'\xE9tudiant *" }),
            /* @__PURE__ */ jsxDEV("input", { type: "text", id: "formFullName", class: "form-input", placeholder: "Ex: Moussa Traor\xE9", required: true })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "formCountry", children: "Pays de r\xE9sidence actuel *" }),
            /* @__PURE__ */ jsxDEV("select", { id: "formCountry", class: "form-select", required: true, children: [
              /* @__PURE__ */ jsxDEV("option", { value: "", disabled: true, selected: true, children: "S\xE9lectionnez votre pays..." }),
              /* @__PURE__ */ jsxDEV("option", { value: "S\xE9n\xE9gal \u{1F1F8}\u{1F1F3}", children: "S\xE9n\xE9gal \u{1F1F8}\u{1F1F3}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "C\xF4te d'Ivoire \u{1F1E8}\u{1F1EE}", children: "C\xF4te d'Ivoire \u{1F1E8}\u{1F1EE}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Cameroun \u{1F1E8}\u{1F1F2}", children: "Cameroun \u{1F1E8}\u{1F1F2}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Gabon \u{1F1EC}\u{1F1E6}", children: "Gabon \u{1F1EC}\u{1F1E6}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Guin\xE9e \u{1F1EC}\u{1F1F3}", children: "Guin\xE9e \u{1F1EC}\u{1F1F3}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Congo \u{1F1E8}\u{1F1EC}", children: "Congo (Brazzaville) \u{1F1E8}\u{1F1EC}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "RDC \u{1F1E8}\u{1F1E9}", children: "RD Congo (Kinshasa) \u{1F1E8}\u{1F1E9}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Mali \u{1F1F2}\u{1F1F1}", children: "Mali \u{1F1F2}\u{1F1F1}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Togo \u{1F1F9}\u{1F1EC}", children: "Togo \u{1F1F9}\u{1F1EC}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "B\xE9nin \u{1F1E7}\u{1F1EF}", children: "B\xE9nin \u{1F1E7}\u{1F1EF}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Tchad \u{1F1F9}\u{1F1E9}", children: "Tchad \u{1F1F9}\u{1F1E9}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Burkina Faso \u{1F1E7}\u{1F1EB}", children: "Burkina Faso \u{1F1E7}\u{1F1EB}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "France / Diaspora \u{1F1EB}\u{1F1F7}", children: "France / Europe / Diaspora \u{1F1EB}\u{1F1F7}" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Autre pays", children: "Autre pays" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "form-row-2", children: [
          /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "formCurrentLevel", children: "Niveau d'\xE9tudes pr\xE9par\xE9 ou obtenu *" }),
            /* @__PURE__ */ jsxDEV("select", { id: "formCurrentLevel", class: "form-select", required: true, children: [
              /* @__PURE__ */ jsxDEV("option", { value: "Terminale / Baccalaur\xE9at 2026 en cours", children: "Terminale / Baccalaur\xE9at 2026 en cours" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Bachelier (Bac d\xE9j\xE0 en poche)", children: "Bachelier (Bac d\xE9j\xE0 en poche)" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Bac+1 / Bac+2 (Licence en cours)", children: "Bac+1 / Bac+2 (Licence en cours)" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Licence / Bachelor (Bac+3 valid\xE9)", children: "Licence / Bachelor (Bac+3 valid\xE9)" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Master ou dipl\xF4me sup\xE9rieur", children: "Master ou dipl\xF4me sup\xE9rieur" })
            ] })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "formBacSeries", children: "S\xE9rie du Bac & Mention obtenue ou vis\xE9e *" }),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                id: "formBacSeries",
                class: "form-input",
                placeholder: "Ex: S\xE9rie S2 / C / D / G2 / SES - Mention Bien",
                required: true
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "form-buttons-row", style: "justify-content: flex-end;", children: /* @__PURE__ */ jsxDEV("button", { type: "button", class: "btn-primary btn-next-step", children: [
          /* @__PURE__ */ jsxDEV("span", { children: "Continuer : Mon Projet au Maroc" }),
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-right" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "form-step-panel", "data-step": "2", children: [
        /* @__PURE__ */ jsxDEV("h3", { class: "panel-heading", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-book-open text-rose" }),
          " \xC9tape 2 : Votre Projet d'\xC9tudes au Maroc"
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "form-row-2", children: [
          /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "formStudyDomain", children: "Fili\xE8re d'\xE9tudes souhait\xE9e *" }),
            /* @__PURE__ */ jsxDEV("select", { id: "formStudyDomain", class: "form-select", required: true, children: [
              /* @__PURE__ */ jsxDEV("option", { value: "medecine", children: "M\xE9decine G\xE9n\xE9rale, Dentaire ou Pharmacie" }),
              /* @__PURE__ */ jsxDEV("option", { value: "ingenierie", selected: true, children: "G\xE9nie Informatique, IA, Big Data & Cybers\xE9curit\xE9" }),
              /* @__PURE__ */ jsxDEV("option", { value: "business", children: "Management, Audit, Finance, Supply Chain & Commerce" }),
              /* @__PURE__ */ jsxDEV("option", { value: "architecture", children: "Architecture, Urbanisme & Design" }),
              /* @__PURE__ */ jsxDEV("option", { value: "droit", children: "Droit International des Affaires & Sciences Politiques" }),
              /* @__PURE__ */ jsxDEV("option", { value: "autre", children: "Autre fili\xE8re / Je souhaite \xEAtre conseill\xE9" })
            ] })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "formTargetCity", children: "Ville marocaine de pr\xE9f\xE9rence *" }),
            /* @__PURE__ */ jsxDEV("select", { id: "formTargetCity", class: "form-select", required: true, children: [
              /* @__PURE__ */ jsxDEV("option", { value: "F\xE8s (Euromed)", children: "F\xE8s (Campus Euromed UEMF)" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Casablanca", selected: true, children: "Casablanca (ESTEM, EMSI, ESCA, UIC, Mundia)" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Rabat", children: "Rabat (UIASS Sant\xE9, UIR, UM6P)" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Marrakech", children: "Marrakech" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Tanger", children: "Tanger" }),
              /* @__PURE__ */ jsxDEV("option", { value: "Au meilleur campus", children: "Au meilleur campus selon mon profil" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
          /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "formTargetUniversity", children: "Universit\xE9 Priv\xE9e cibl\xE9e (Facultatif)" }),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              id: "formTargetUniversity",
              class: "form-input",
              placeholder: "Ex: UEMF Euromed, ESTEM Casa, UIASS, EMSI, UIR ou 'Laissez Wicka me conseiller'"
            }
          )
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "form-buttons-row", children: [
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "btn-secondary btn-prev-step", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-left" }),
            " ",
            /* @__PURE__ */ jsxDEV("span", { children: "Retour" })
          ] }),
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "btn-primary btn-next-step", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Continuer : Formule & Navette" }),
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-right" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "form-step-panel", "data-step": "3", children: [
        /* @__PURE__ */ jsxDEV("h3", { class: "panel-heading", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-cubes text-rose" }),
          " \xC9tape 3 : Formule d'Assistance & Navette A\xE9roport"
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
          /* @__PURE__ */ jsxDEV("label", { class: "form-label", children: "Choisissez votre formule :" }),
          /* @__PURE__ */ jsxDEV("div", { class: "sim-radio-cards application-pack-options", style: "grid-template-columns: 1fr 1fr 1fr;", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "sim-radio-card", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "formPackChoice", value: "Pack Diagnostic & Orientation (290 DH)" }),
              /* @__PURE__ */ jsxDEV("div", { class: "sim-radio-content", children: [
                /* @__PURE__ */ jsxDEV("i", { class: "fas fa-compass" }),
                /* @__PURE__ */ jsxDEV("span", { children: "Diagnostic" }),
                /* @__PURE__ */ jsxDEV("small", { style: "color: var(--rose-700); font-weight: 700;", children: "290 DH" })
              ] })
            ] }),
            /* @__PURE__ */ jsxDEV("label", { class: "sim-radio-card", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "formPackChoice", value: "Pack Admission R\xE9ussie", checked: true }),
              /* @__PURE__ */ jsxDEV("div", { class: "sim-radio-content", children: [
                /* @__PURE__ */ jsxDEV("i", { class: "fas fa-certificate" }),
                /* @__PURE__ */ jsxDEV("span", { children: "Pack Admission" }),
                /* @__PURE__ */ jsxDEV("small", { style: "color: var(--rose-700); font-weight: 700;", children: "\u2B50 Recommand\xE9" })
              ] })
            ] }),
            /* @__PURE__ */ jsxDEV("label", { class: "sim-radio-card", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "formPackChoice", value: "Pack VIP & Navette A\xE9roport" }),
              /* @__PURE__ */ jsxDEV("div", { class: "sim-radio-content", children: [
                /* @__PURE__ */ jsxDEV("i", { class: "fas fa-car-side" }),
                /* @__PURE__ */ jsxDEV("span", { children: "VIP & Navette" }),
                /* @__PURE__ */ jsxDEV("small", { style: "color: var(--rose-700); font-weight: 700;", children: "Chauffeur Priv\xE9" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "form-row-2", children: [
          /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "form-label", children: "Souhaitez-vous la Navette A\xE9roport Priv\xE9e s\xE9curis\xE9e avec chauffeur ?" }),
            /* @__PURE__ */ jsxDEV("div", { class: "airport-transfer-options", style: "display: flex; gap: 20px; margin-top: 10px;", children: [
              /* @__PURE__ */ jsxDEV("label", { style: "display: flex; align-items: center; gap: 8px; cursor: pointer;", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "formAirportTransfer", value: "Oui, navette avec chauffeur demand\xE9e", checked: true }),
                /* @__PURE__ */ jsxDEV("span", { children: "Oui, transfert direct vers ma ville" })
              ] }),
              /* @__PURE__ */ jsxDEV("label", { style: "display: flex; align-items: center; gap: 8px; cursor: pointer;", children: [
                /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "formAirportTransfer", value: "Non, j'ai mes propres moyens de transport" }),
                /* @__PURE__ */ jsxDEV("span", { children: "Non, j'ai d\xE9j\xE0 mes propres moyens" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "formNotes", children: "Pr\xE9cisions \xE9ventuelles ou questions des parents" }),
            /* @__PURE__ */ jsxDEV(
              "textarea",
              {
                id: "formNotes",
                class: "form-textarea",
                rows: 2,
                placeholder: "Bourse, budget annuel maximum, date d'arriv\xE9e souhait\xE9e..."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "form-buttons-row", children: [
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "btn-secondary btn-prev-step", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-left" }),
            " ",
            /* @__PURE__ */ jsxDEV("span", { children: "Retour" })
          ] }),
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "btn-primary btn-next-step", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Continuer : Coordonn\xE9es de Contact" }),
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-right" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "form-step-panel", "data-step": "4", children: [
        /* @__PURE__ */ jsxDEV("h3", { class: "panel-heading", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-phone-alt text-rose" }),
          " \xC9tape 4 : Vos Coordonn\xE9es pour l'Envoi du Bilan"
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "form-row-2", children: [
          /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "formWhatsapp", children: "Num\xE9ro WhatsApp (avec indicatif pays) *" }),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "tel",
                id: "formWhatsapp",
                class: "form-input",
                placeholder: "Ex: +221 77 123 45 67 ou +225 07...",
                required: true
              }
            ),
            /* @__PURE__ */ jsxDEV("small", { style: "color: var(--slate-500); font-size: 0.76rem;", children: "Nos conseillers vous contacteront directement sur WhatsApp pour l'envoi de la grille d'admissibilit\xE9." })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "formEmail", children: "Adresse Email de contact *" }),
            /* @__PURE__ */ jsxDEV("input", { type: "email", id: "formEmail", class: "form-input", placeholder: "votre.email@gmail.com", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("label", { class: "legal-consent", children: [
          /* @__PURE__ */ jsxDEV("input", { id: "applicationConsent", name: "consent", value: "accepted", type: "checkbox", required: true }),
          " ",
          /* @__PURE__ */ jsxDEV("span", { children: [
            "J\u2019accepte que mes donn\xE9es soient utilis\xE9es pour traiter ma candidature, conform\xE9ment \xE0 la",
            " ",
            /* @__PURE__ */ jsxDEV("a", { href: "/politique-confidentialite", children: "politique de confidentialit\xE9" }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { style: "background-color: var(--rose-50); border: 1px solid var(--rose-200); border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 20px; font-size: 0.85rem; color: var(--rose-900);", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-lock" }),
          " ",
          /* @__PURE__ */ jsxDEV("strong", { children: "Engagement de confidentialit\xE9 :" }),
          " Vos donn\xE9es sont prot\xE9g\xE9es et ne servent qu'aux proc\xE9dures officielles d'admission universitaire."
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "form-buttons-row", children: [
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "btn-secondary btn-prev-step", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-left" }),
            " ",
            /* @__PURE__ */ jsxDEV("span", { children: "Retour" })
          ] }),
          /* @__PURE__ */ jsxDEV("button", { type: "submit", class: "btn-primary", style: "padding: 16px 36px; font-size: 1.05rem;", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            /* @__PURE__ */ jsxDEV("span", { children: "Soumettre ma Candidature Officielle" })
          ] })
        ] })
      ] })
    ] })
  ] })
] }) });

// src/pages/Universites.tsx
var universitesMeta = {
  title: "Universit\xE9s priv\xE9es au Maroc | Orientation",
  description: "Comparez les fili\xE8res, les villes et les parcours d\u2019\xE9tudes au Maroc avec un accompagnement personnalis\xE9 pour choisir une formation adapt\xE9e \xE0 votre projet.",
  keywords: "universit\xE9s priv\xE9es Maroc, \xE9tudes sup\xE9rieures Maroc, formations Maroc, orientation universitaire, fili\xE8res Maroc, \xE9tudiant international"
};
var Universites = () => /* @__PURE__ */ jsxDEV(Fragment, { children: [
  /* @__PURE__ */ jsxDEV("section", { class: "universities-section", id: "universites", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-university" }),
        " Universit\xE9s Priv\xE9es d'Excellence"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "Grandes \xC9coles & Universit\xE9s Priv\xE9es Partenaires" }),
      /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: [
        "Wicka Assistance travaille exclusivement avec les meilleures institutions priv\xE9es accr\xE9dit\xE9es par l'\xC9tat marocain :",
        " ",
        /* @__PURE__ */ jsxDEV("strong", { children: "UEMF Euromed F\xE8s, Al Akhawayn Ifrane, UM6SS, UM6P, ESCA, UIASS, UIR, ESTEM, EMSI, UPM Marrakech, UPF F\xE8s, ISGA" }),
        " ",
        "et bien d'autres. Chaque fiche inclut une mini-description pour vous aider \xE0 choisir."
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "filter-bar-wrapper", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "filter-top-row", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "search-input-wrap", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-search" }),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              id: "universitySearchInput",
              placeholder: "Rechercher une \xE9cole, un dipl\xF4me (ex: Euromed F\xE8s, ESTEM, Pharmacie, IA, A\xE9rospatiale, M\xE9decine)..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "city-select-wrap", children: /* @__PURE__ */ jsxDEV("select", { id: "cityFilterSelect", children: [
          /* @__PURE__ */ jsxDEV("option", { value: "all", children: "Toutes les Villes" }),
          /* @__PURE__ */ jsxDEV("option", { value: "casablanca", children: "Casablanca" }),
          /* @__PURE__ */ jsxDEV("option", { value: "rabat", children: "Rabat / Sal\xE9" }),
          /* @__PURE__ */ jsxDEV("option", { value: "fes", children: "F\xE8s (Euromed)" }),
          /* @__PURE__ */ jsxDEV("option", { value: "marrakech", children: "Marrakech" }),
          /* @__PURE__ */ jsxDEV("option", { value: "tanger", children: "Tanger" }),
          /* @__PURE__ */ jsxDEV("option", { value: "ifrane", children: "Ifrane (Al Akhawayn)" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "filter-tabs-row", children: [
        /* @__PURE__ */ jsxDEV("button", { type: "button", class: "filter-tab-btn active", "data-domain": "all", children: "Toutes les Fili\xE8res" }),
        /* @__PURE__ */ jsxDEV("button", { type: "button", class: "filter-tab-btn", "data-domain": "medecine", children: "\u{1FA7A} M\xE9decine & Pharmacie (UIASS, UIC)" }),
        /* @__PURE__ */ jsxDEV("button", { type: "button", class: "filter-tab-btn", "data-domain": "ingenierie", children: "\u{1F4BB} Ing\xE9nierie & IA (Euromed, EMSI, UIR)" }),
        /* @__PURE__ */ jsxDEV("button", { type: "button", class: "filter-tab-btn", "data-domain": "business", children: "\u{1F4C8} Business & Finance (ESTEM, ESCA, HEM)" }),
        /* @__PURE__ */ jsxDEV("button", { type: "button", class: "filter-tab-btn", "data-domain": "architecture", children: "\u{1F3DB}\uFE0F Architecture & Urbanisme" }),
        /* @__PURE__ */ jsxDEV("button", { type: "button", class: "filter-tab-btn", "data-domain": "droit", children: "\u2696\uFE0F Droit & Sciences Politiques" })
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "universities-count-bar", id: "universitiesCount", children: "Chargement des \xE9tablissements..." }),
    /* @__PURE__ */ jsxDEV("div", { class: "universities-grid", id: "universitiesGrid" })
  ] }) }),
  /* @__PURE__ */ jsxDEV("section", { class: "cta-band", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: /* @__PURE__ */ jsxDEV("div", { class: "cta-band-inner", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "cta-band-glow" }),
    /* @__PURE__ */ jsxDEV("div", { class: "cta-band-text", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "cta-band-kicker", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-bolt" }),
        " Places limit\xE9es \xB7 Promo \u221250%"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { children: "Vous h\xE9sitez entre plusieurs \xE9coles ? Ne perdez pas votre place." }),
      /* @__PURE__ */ jsxDEV("p", { children: "Un conseiller Wicka analyse votre dossier et vous r\xE9serve une admission dans la meilleure universit\xE9 priv\xE9e pour votre profil \u2014 en 24h." }),
      /* @__PURE__ */ jsxDEV("div", { class: "cta-band-trust", children: [
        /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-circle-check" }),
          " R\xE9ponse en 24h"
        ] }),
        /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-circle-check" }),
          " 98% de visa obtenu"
        ] }),
        /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-circle-check" }),
          " Paiement local s\xE9curis\xE9"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "cta-band-actions", children: [
      /* @__PURE__ */ jsxDEV(
        "a",
        {
          href: waLink("Bonjour Wicka, je veux r\xE9server ma place \xE9tudiant au Maroc (Promo)."),
          target: "_blank",
          rel: "noopener noreferrer",
          class: "btn-cta-white",
          children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
            " R\xE9server ma place maintenant"
          ]
        }
      ),
      /* @__PURE__ */ jsxDEV("a", { href: "/candidature", class: "btn-cta-ghost", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-paper-plane" }),
        " Faire \xE9valuer mon dossier"
      ] }),
      /* @__PURE__ */ jsxDEV("span", { class: "cta-band-microcopy", children: "\u{1F512} Sans engagement \xB7 R\xE9ponse d'un conseiller sous 30 min" })
    ] })
  ] }) }) })
] });

// src/pages/Tarifs.tsx
var tarifsMeta = {
  title: "Tarifs \xE9tudes au Maroc | Packs & accompagnement",
  description: "D\xE9couvrez les tarifs d\u2019accompagnement pour \xE9tudier au Maroc : orientation, admission, visa, accueil et services adapt\xE9s \xE0 votre pays.",
  keywords: "tarifs \xE9tudes Maroc, prix admission Maroc, accompagnement \xE9tudiant, pack admission, visa \xE9tudiant Maroc, co\xFBt \xE9tudes Maroc, Wicka Assistance"
};
var Tarifs = () => /* @__PURE__ */ jsxDEV(Fragment, { children: [
  /* @__PURE__ */ jsxDEV("section", { class: "pricing-section", id: "tarifs-pays", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-globe-africa" }),
        " Transparence Financi\xE8re Internationale"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "Tarifs Adapt\xE9s Selon le Pays du Candidat" }),
      /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "S\xE9lectionnez votre pays de r\xE9sidence pour afficher nos tarifs dans votre devise locale ainsi que les moyens de paiement disponibles (Wave, Orange Money, MTN MoMo, Airtel, Virement...)." })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "country-pricing-widget", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "promo-ribbon-bar", children: [
        /* @__PURE__ */ jsxDEV("span", { class: "promo-flame", children: "\u{1F525}" }),
        /* @__PURE__ */ jsxDEV("div", { class: "promo-ribbon-text", children: [
          /* @__PURE__ */ jsxDEV("strong", { children: "PROMOTION DE LANCEMENT \u221250%" }),
          /* @__PURE__ */ jsxDEV("span", { children: "Tarifs de lancement \xE0 dur\xE9e limit\xE9e. Le prix est bloqu\xE9 et garanti d\xE8s la signature de votre contrat." }),
          /* @__PURE__ */ jsxDEV("span", { class: "promo-places", id: "promoPlaces", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-fire" }),
            " Plus que ",
            /* @__PURE__ */ jsxDEV("b", { children: "14 places" }),
            " \xE0 ce tarif promotionnel"
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("span", { class: "promo-badge-pct", children: "-50%" })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "country-selector-bar", children: [
        /* @__PURE__ */ jsxDEV("label", { class: "country-selector-label", for: "pricingCountrySelect", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-map-pin text-rose" }),
          " Choisissez votre pays de r\xE9sidence :"
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "country-pills-wrap", children: [
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "country-pill-btn active", "data-country": "senegal", children: "S\xE9n\xE9gal \u{1F1F8}\u{1F1F3}" }),
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "country-pill-btn", "data-country": "ivory_coast", children: "C\xF4te d'Ivoire \u{1F1E8}\u{1F1EE}" }),
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "country-pill-btn", "data-country": "cameroon", children: "Cameroun \u{1F1E8}\u{1F1F2}" }),
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "country-pill-btn", "data-country": "gabon", children: "Gabon \u{1F1EC}\u{1F1E6}" }),
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "country-pill-btn", "data-country": "guinea", children: "Guin\xE9e \u{1F1EC}\u{1F1F3}" }),
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "country-pill-btn", "data-country": "congo", children: "Congo / RDC \u{1F1E8}\u{1F1EC} \u{1F1E8}\u{1F1E9}" }),
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "country-pill-btn", "data-country": "diaspora_europe", children: "France / Diaspora \u{1F1EB}\u{1F1F7} \u{1F1EA}\u{1F1FA}" }),
          /* @__PURE__ */ jsxDEV("button", { type: "button", class: "country-pill-btn", "data-country": "maroc", children: "Maroc (Sur place) \u{1F1F2}\u{1F1E6}" })
        ] }),
        /* @__PURE__ */ jsxDEV("select", { id: "pricingCountrySelect", style: "display: none;", children: [
          /* @__PURE__ */ jsxDEV("option", { value: "senegal", selected: true, children: "S\xE9n\xE9gal" }),
          /* @__PURE__ */ jsxDEV("option", { value: "ivory_coast", children: "C\xF4te d'Ivoire" }),
          /* @__PURE__ */ jsxDEV("option", { value: "cameroon", children: "Cameroun" }),
          /* @__PURE__ */ jsxDEV("option", { value: "gabon", children: "Gabon" }),
          /* @__PURE__ */ jsxDEV("option", { value: "guinea", children: "Guin\xE9e" }),
          /* @__PURE__ */ jsxDEV("option", { value: "congo", children: "Congo" }),
          /* @__PURE__ */ jsxDEV("option", { value: "diaspora_europe", children: "France / Diaspora" }),
          /* @__PURE__ */ jsxDEV("option", { value: "maroc", children: "Maroc" })
        ] })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "country-display-grid", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "country-pack-col", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("span", { class: "badge-rose-soft", children: "\u2B50 Le Plus Populaire" }),
            /* @__PURE__ */ jsxDEV("h3", { class: "country-pack-title", children: "Pack Admission R\xE9ussie" }),
            /* @__PURE__ */ jsxDEV("p", { style: "font-size: 0.85rem; color: var(--slate-600);", children: "D\xE9p\xF4t de 3 \xE0 5 candidatures universitaires + Suivi jusqu'\xE0 la Lettre d'Admission Officielle + Aide Bourse + Dossier Carte Consulaire (ambassade) + Attestation Visa." }),
            /* @__PURE__ */ jsxDEV("div", { class: "country-pack-price", id: "countryOutAdmissionPrice", children: "60 000 FCFA" })
          ] }),
          /* @__PURE__ */ jsxDEV(
            "a",
            {
              href: waLink(),
              target: "_blank",
              rel: "noopener noreferrer",
              class: "btn-primary btn-full btn-order-pack",
              "data-pack": "Pack Admission",
              children: [
                /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
                " Souscrire dans mon Pays"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            class: "country-pack-col",
            style: "border-color: var(--rose-600); background: linear-gradient(180deg, #ffffff 0%, #fff7f9 100%);",
            children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("span", { class: "badge-rose-soft", style: "background-color: var(--rose-700); color: var(--white);", children: "\u{1F697} Navette A\xE9roport & VIP" }),
                /* @__PURE__ */ jsxDEV("h3", { class: "country-pack-title", children: "Pack VIP All-Inclusive & Navette" }),
                /* @__PURE__ */ jsxDEV("p", { style: "font-size: 0.85rem; color: var(--slate-600);", children: [
                  "Admission garantie + Dossier Visa & ",
                  /* @__PURE__ */ jsxDEV("strong", { children: "Carte Consulaire jusqu'\xE0 l'ambassade" }),
                  " +",
                  " ",
                  /* @__PURE__ */ jsxDEV("strong", { children: "Navette a\xE9roport priv\xE9e s\xE9curis\xE9e" }),
                  " + Carte SIM 4G + ",
                  /* @__PURE__ */ jsxDEV("strong", { children: "Carte de S\xE9jour" }),
                  " ",
                  "jusqu'\xE0 l'obtention."
                ] }),
                /* @__PURE__ */ jsxDEV("div", { class: "country-pack-price", id: "countryOutVipPrice", children: "120 000 FCFA" })
              ] }),
              /* @__PURE__ */ jsxDEV(
                "a",
                {
                  href: waLink(),
                  target: "_blank",
                  rel: "noopener noreferrer",
                  class: "btn-primary btn-full btn-order-pack",
                  "data-pack": "Pack VIP All-Inclusive",
                  children: [
                    /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
                    " R\xE9server le Pack VIP & Navette"
                  ]
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "payment-methods-wrap", children: [
        /* @__PURE__ */ jsxDEV("span", { class: "payment-methods-label", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-wallet text-rose" }),
          " Moyens de paiement accept\xE9s localement :"
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "payment-chips-list", id: "countryOutPaymentMethods", children: [
          /* @__PURE__ */ jsxDEV("span", { class: "payment-method-chip", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle text-rose" }),
            " Wave"
          ] }),
          /* @__PURE__ */ jsxDEV("span", { class: "payment-method-chip", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle text-rose" }),
            " Orange Money"
          ] }),
          /* @__PURE__ */ jsxDEV("span", { class: "payment-method-chip", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle text-rose" }),
            " Virement Bancaire"
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("p", { id: "countryOutNote", style: "font-size: 0.82rem; color: var(--slate-500); margin-top: 10px;", children: "Paiement local sans frais de change via Wave / Orange Money. Re\xE7u officiel et contrat d\xE9livr\xE9s instantan\xE9ment." }),
        /* @__PURE__ */ jsxDEV("p", { class: "promo-disclaimer", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-circle-info" }),
          " Prix promotionnels de lancement, susceptibles d'\xE9voluer \xE0 tout moment. Tarif garanti d\xE8s la signature du contrat."
        ] })
      ] })
    ] })
  ] }) }),
  /* @__PURE__ */ jsxDEV("section", { class: "simulator-section", id: "simulateur", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-calculator" }),
        " \xC9tude de Co\xFBt R\xE9el"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "Simulateur de Budget de Vie \xC9tudiante au Maroc" }),
      /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "Estimez le budget mensuel n\xE9cessaire pour vivre confortablement selon la ville choisie (F\xE8s, Casablanca, Rabat, Marrakech, Tanger) et convertissez instantan\xE9ment les montants." })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "simulator-card-wrapper", children: /* @__PURE__ */ jsxDEV("div", { class: "simulator-grid", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "sim-controls-panel", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "sim-city-photo", children: [
          /* @__PURE__ */ jsxDEV("img", { id: "simCityPhoto", src: "/assets/uni/casablanca.jpg", alt: "Ville marocaine", loading: "lazy" }),
          /* @__PURE__ */ jsxDEV("span", { id: "simCityPhotoLabel", class: "sim-city-photo-label", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-map-marker-alt" }),
            " Casablanca"
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "sim-control-group", children: [
          /* @__PURE__ */ jsxDEV("label", { class: "sim-label", for: "simCitySelect", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-map-marker-alt text-rose" }),
            " 1. Ville marocaine d'accueil :"
          ] }),
          /* @__PURE__ */ jsxDEV("select", { id: "simCitySelect", class: "sim-select-styled", children: [
            /* @__PURE__ */ jsxDEV("option", { value: "casablanca", selected: true, children: "Casablanca (P\xF4le \xC9conomique & M\xE9tropole)" }),
            /* @__PURE__ */ jsxDEV("option", { value: "rabat", children: "Rabat (Capitale Verte & Cit\xE9 d'Excellence)" }),
            /* @__PURE__ */ jsxDEV("option", { value: "fes", children: "F\xE8s (Campus Euromed & Co\xFBt Tr\xE8s Abordable)" }),
            /* @__PURE__ */ jsxDEV("option", { value: "marrakech", children: "Marrakech (Cadre de Vie Ensoleill\xE9 & Dynamique)" }),
            /* @__PURE__ */ jsxDEV("option", { value: "tanger", children: "Tanger (P\xF4le Industriel & Ouvert sur l'Europe)" }),
            /* @__PURE__ */ jsxDEV("option", { value: "ifrane", children: "Ifrane (Campus Al Akhawayn & Co\xFBt le Plus Bas)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "sim-control-group", children: [
          /* @__PURE__ */ jsxDEV("label", { class: "sim-label", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-graduation-cap text-rose" }),
            " 2. Cat\xE9gorie d'\xE9tablissement vis\xE9 :"
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "sim-radio-cards", children: [
            /* @__PURE__ */ jsxDEV("label", { class: "sim-radio-card", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "simUniType", value: "prive_standard", checked: true }),
              /* @__PURE__ */ jsxDEV("div", { class: "sim-radio-content", children: [
                /* @__PURE__ */ jsxDEV("i", { class: "fas fa-award" }),
                /* @__PURE__ */ jsxDEV("span", { children: "Grande \xC9cole Priv\xE9e" }),
                /* @__PURE__ */ jsxDEV("small", { style: "font-size: 0.72rem; color: var(--slate-500);", children: "ESTEM, EMSI, Mundia (42k-50k DH)" })
              ] })
            ] }),
            /* @__PURE__ */ jsxDEV("label", { class: "sim-radio-card", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "simUniType", value: "prive_excellence" }),
              /* @__PURE__ */ jsxDEV("div", { class: "sim-radio-content", children: [
                /* @__PURE__ */ jsxDEV("i", { class: "fas fa-star" }),
                /* @__PURE__ */ jsxDEV("span", { children: "P\xF4le d'\xC9lite & Sant\xE9" }),
                /* @__PURE__ */ jsxDEV("small", { style: "font-size: 0.72rem; color: var(--slate-500);", children: "UEMF, UIASS, UIR, UM6P" })
              ] })
            ] }),
            /* @__PURE__ */ jsxDEV("label", { class: "sim-radio-card", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "radio", name: "simUniType", value: "public_assiste" }),
              /* @__PURE__ */ jsxDEV("div", { class: "sim-radio-content", children: [
                /* @__PURE__ */ jsxDEV("i", { class: "fas fa-landmark" }),
                /* @__PURE__ */ jsxDEV("span", { children: "Facult\xE9 Publique" }),
                /* @__PURE__ */ jsxDEV("small", { style: "font-size: 0.72rem; color: var(--slate-500);", children: "Frais symboliques" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { style: "background-color: var(--rose-soft); border: 1px solid var(--rose-200); border-radius: var(--radius-md); padding: 16px; margin-top: 10px;", children: [
          /* @__PURE__ */ jsxDEV("strong", { style: "color: var(--rose-900); font-size: 0.88rem;", children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-info-circle" }),
            " Sp\xE9cificit\xE9 de cette ville :"
          ] }),
          /* @__PURE__ */ jsxDEV("p", { id: "simCityAdvantages", style: "font-size: 0.85rem; color: var(--slate-700); margin-top: 4px;", children: "Immense vivier de stages, si\xE8ges de multinationales, transports 24/7." })
        ] })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "sim-results-panel", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("div", { class: "sim-results-header", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h3", { children: "Estimation du Budget" }),
              /* @__PURE__ */ jsxDEV("span", { id: "simCityBadgeLabel", style: "font-size: 0.78rem; color: var(--rose-200);", children: "P\xF4le \xC9conomique & Cosmopolite" })
            ] }),
            /* @__PURE__ */ jsxDEV("div", { class: "currency-chips-wrap", children: [
              /* @__PURE__ */ jsxDEV("button", { type: "button", class: "currency-chip active", "data-currency": "MAD", children: "MAD" }),
              /* @__PURE__ */ jsxDEV("button", { type: "button", class: "currency-chip", "data-currency": "XOF", children: "FCFA" }),
              /* @__PURE__ */ jsxDEV("button", { type: "button", class: "currency-chip", "data-currency": "EUR", children: "EUR" }),
              /* @__PURE__ */ jsxDEV("button", { type: "button", class: "currency-chip", "data-currency": "USD", children: "USD" })
            ] }),
            /* @__PURE__ */ jsxDEV("select", { id: "simCurrencySelect", style: "display:none;", children: [
              /* @__PURE__ */ jsxDEV("option", { value: "MAD", selected: true, children: "MAD" }),
              /* @__PURE__ */ jsxDEV("option", { value: "XOF", children: "XOF" }),
              /* @__PURE__ */ jsxDEV("option", { value: "EUR", children: "EUR" }),
              /* @__PURE__ */ jsxDEV("option", { value: "USD", children: "USD" })
            ] })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "sim-breakdown-list", children: [
            /* @__PURE__ */ jsxDEV("div", { class: "sim-breakdown-item", children: [
              /* @__PURE__ */ jsxDEV("span", { children: [
                /* @__PURE__ */ jsxDEV("i", { class: "fas fa-utensils" }),
                " Alimentation & Courses :"
              ] }),
              /* @__PURE__ */ jsxDEV("strong", { id: "simOutFood", children: "1 300 DH" })
            ] }),
            /* @__PURE__ */ jsxDEV("div", { class: "sim-breakdown-item", children: [
              /* @__PURE__ */ jsxDEV("span", { children: [
                /* @__PURE__ */ jsxDEV("i", { class: "fas fa-train" }),
                " Transport (Tramway/Taxis) & Forfait 4G :"
              ] }),
              /* @__PURE__ */ jsxDEV("strong", { id: "simOutTransport", children: "250 DH" })
            ] }),
            /* @__PURE__ */ jsxDEV("div", { class: "sim-breakdown-item", children: [
              /* @__PURE__ */ jsxDEV("span", { children: [
                /* @__PURE__ */ jsxDEV("i", { class: "fas fa-book" }),
                " Fournitures & Loisirs :"
              ] }),
              /* @__PURE__ */ jsxDEV("strong", { id: "simOutLifestyle", children: "450 DH" })
            ] })
          ] }),
          /* @__PURE__ */ jsxDEV("div", { class: "sim-total-highlight", children: [
            /* @__PURE__ */ jsxDEV("span", { class: "sim-total-label", children: "Budget de Vie Mensuel Conseill\xE9 :" }),
            /* @__PURE__ */ jsxDEV("div", { class: "sim-total-val", id: "simOutMonthlyLiving", children: "2 000 DH / mois" })
          ] }),
          /* @__PURE__ */ jsxDEV(
            "div",
            {
              class: "sim-breakdown-item",
              style: "border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 12px; margin-bottom: 8px;",
              children: [
                /* @__PURE__ */ jsxDEV("span", { children: "Frais Scolarit\xE9 Universit\xE9 (Annuel) :" }),
                /* @__PURE__ */ jsxDEV("strong", { id: "simOutTuitionYear", style: "color: var(--gold-light);", children: "46 000 DH / an" })
              ]
            }
          ),
          /* @__PURE__ */ jsxDEV("div", { class: "sim-breakdown-item", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Grand Total Annuel Estim\xE9 (Vie 10 mois + \xC9cole) :" }),
            /* @__PURE__ */ jsxDEV("strong", { id: "simOutGrandTotalYear", style: "color: var(--white); font-size: 1.15rem;", children: "66 000 DH / an" })
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: "/candidature",
            class: "btn-primary btn-full",
            style: "margin-top: 20px; background: var(--white); color: var(--rose-900);",
            children: [
              /* @__PURE__ */ jsxDEV("span", { children: "Faire \xC9valuer Mon Dossier" }),
              /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-right" })
            ]
          }
        )
      ] })
    ] }) })
  ] }) }),
  /* @__PURE__ */ jsxDEV("section", { class: "pricing-section", id: "packs", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "section-badge badge-promo", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-fire" }),
        " Promo Lancement \u221250%"
      ] }),
      /* @__PURE__ */ jsxDEV("h2", { class: "section-title", children: "Choisissez la Formule Adapt\xE9e \xE0 Votre Projet" }),
      /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: [
        "Profitez de nos ",
        /* @__PURE__ */ jsxDEV("strong", { children: "tarifs promotionnels de lancement" }),
        " \u2014 parmi les plus accessibles du march\xE9 \u2014 payables localement dans votre devise (Wave, Orange Money, MTN, Virement)."
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "pricing-grid", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "pricing-card", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "pack-header", children: [
          /* @__PURE__ */ jsxDEV("span", { class: "badge-rose-soft", children: "Pour d\xE9marrer" }),
          /* @__PURE__ */ jsxDEV("h3", { class: "pack-name", children: "Pack Diagnostic & Orientation" }),
          /* @__PURE__ */ jsxDEV("p", { style: "font-size: 0.85rem; color: var(--slate-500);", children: "Analyse de dossier & s\xE9lection des universit\xE9s" }),
          /* @__PURE__ */ jsxDEV("div", { class: "pack-price-box", children: [
            /* @__PURE__ */ jsxDEV("span", { class: "pack-price-old", children: "590 DH" }),
            /* @__PURE__ */ jsxDEV("span", { class: "pack-price", children: "290 DH" }),
            /* @__PURE__ */ jsxDEV("span", { class: "pack-price-cut", children: "\u221251%" })
          ] }),
          /* @__PURE__ */ jsxDEV("span", { class: "pack-subprice", children: "\u{1F525} Prix PROMO de lancement \xB7 ~18 000 FCFA / 27 \u20AC \xB7 Sans engagement" })
        ] }),
        /* @__PURE__ */ jsxDEV("ul", { class: "pack-features-list", children: [
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Audit approfondi des relev\xE9s de notes de l'\xE9l\xE8ve"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Recommandation personnalis\xE9e de 3 universit\xE9s priv\xE9es"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Estimation pr\xE9cise des frais de scolarit\xE9 par ville"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Guide complet sur la vie et la s\xE9curit\xE9 au Maroc"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Entretien d'orientation de 30 min avec un expert"
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: waLink("Bonjour Wicka, je souhaite souscrire au Pack Diagnostic & Orientation (290 DH)."),
            target: "_blank",
            rel: "noopener noreferrer",
            class: "btn-secondary btn-full",
            children: [
              /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp text-rose" }),
              " ",
              /* @__PURE__ */ jsxDEV("span", { children: "Souscrire au Diagnostic" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "pricing-card featured", children: [
        /* @__PURE__ */ jsxDEV("span", { class: "pricing-badge-popular", children: "\u2B50 Le Plus Choisi (90% des familles)" }),
        /* @__PURE__ */ jsxDEV("div", { class: "pack-header", children: [
          /* @__PURE__ */ jsxDEV("span", { class: "badge-rose-soft", style: "background-color: var(--rose-700); color: var(--white);", children: "Admission Garantie" }),
          /* @__PURE__ */ jsxDEV("h3", { class: "pack-name", style: "margin-top: 8px;", children: "Pack Admission R\xE9ussie" }),
          /* @__PURE__ */ jsxDEV("p", { style: "font-size: 0.85rem; color: var(--slate-500);", children: "Admission officielle dans l'universit\xE9 priv\xE9e cibl\xE9e" }),
          /* @__PURE__ */ jsxDEV("div", { class: "pack-price-box", children: [
            /* @__PURE__ */ jsxDEV("span", { class: "pack-price-old", children: "1 990 DH" }),
            /* @__PURE__ */ jsxDEV("span", { class: "pack-price", children: "990 DH" }),
            /* @__PURE__ */ jsxDEV("span", { class: "pack-price-cut", children: "\u221250%" })
          ] }),
          /* @__PURE__ */ jsxDEV("span", { class: "pack-subprice", children: "\u{1F525} Prix PROMO de lancement \xB7 ~60 000 FCFA / 92 \u20AC (Wave, Orange Money)" })
        ] }),
        /* @__PURE__ */ jsxDEV("ul", { class: "pack-features-list", children: [
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " ",
            /* @__PURE__ */ jsxDEV("strong", { children: "Toutes les prestations du Pack Orientation" })
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " D\xE9p\xF4t prioritaire de 3 \xE0 5 candidatures universitaires"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " R\xE9daction et optimisation de CV & lettres de motivation"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Pr\xE9paration personnalis\xE9e aux oraux d'admission"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Suivi direct jusqu'\xE0 la Lettre d'Admission Officielle"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Assistance pour les demandes de bourses d'\xE9tudes"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Constitution du dossier de ",
            /* @__PURE__ */ jsxDEV("strong", { children: "Carte Consulaire" }),
            " aupr\xE8s de l'ambassade du Maroc"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " D\xE9livrance de l'attestation officielle pour le visa"
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: waLink("Bonjour Wicka, je souhaite souscrire au Pack Admission R\xE9ussie."),
            target: "_blank",
            rel: "noopener noreferrer",
            class: "btn-primary btn-full",
            children: [
              /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
              " Choisir le Pack Admission"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "pricing-card", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "pack-header", children: [
          /* @__PURE__ */ jsxDEV("span", { class: "badge-rose-soft", style: "background-color: var(--gold-light); color: var(--gold);", children: "\u{1F697} Navette & S\xE9r\xE9nit\xE9 Totale" }),
          /* @__PURE__ */ jsxDEV("h3", { class: "pack-name", children: "Pack VIP & Navette A\xE9roport" }),
          /* @__PURE__ */ jsxDEV("p", { style: "font-size: 0.85rem; color: var(--slate-500);", children: "Prise en charge compl\xE8te d\xE8s l'atterrissage" }),
          /* @__PURE__ */ jsxDEV("div", { class: "pack-price-box", children: [
            /* @__PURE__ */ jsxDEV("span", { class: "pack-price-old", children: "3 890 DH" }),
            /* @__PURE__ */ jsxDEV("span", { class: "pack-price", children: "1 990 DH" }),
            /* @__PURE__ */ jsxDEV("span", { class: "pack-price-cut", children: "\u221249%" })
          ] }),
          /* @__PURE__ */ jsxDEV("span", { class: "pack-subprice", children: "\u{1F525} Prix PROMO de lancement \xB7 ~120 000 FCFA / 185 \u20AC (chauffeur inclus)" })
        ] }),
        /* @__PURE__ */ jsxDEV("ul", { class: "pack-features-list", children: [
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " ",
            /* @__PURE__ */ jsxDEV("strong", { children: "Toutes les prestations du Pack Admission R\xE9ussie" })
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Montage et validation du dossier consulaire de Visa"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " ",
            /* @__PURE__ */ jsxDEV("strong", { children: "\u{1F3DB}\uFE0F Carte Consulaire :" }),
            " accompagnement complet jusqu'au d\xE9p\xF4t \xE0 l'ambassade du Maroc"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " ",
            /* @__PURE__ */ jsxDEV("strong", { children: "\u{1F697} Navette A\xE9roport Priv\xE9e S\xE9curis\xE9e" }),
            " : Chauffeur d\xE9di\xE9 \xE0 l'arriv\xE9e vers votre ville (Casablanca, Rabat, F\xE8s, Marrakech, Tanger, Ifrane)"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " ",
            /* @__PURE__ */ jsxDEV("strong", { children: "\u{1F4F1} Carte SIM 4G locale" }),
            " avec forfait internet remise en main propre"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Accompagnement pour l'ouverture de compte bancaire"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " ",
            /* @__PURE__ */ jsxDEV("strong", { children: "\u{1F4D1} Carte de S\xE9jour :" }),
            " prise en charge int\xE9grale du dossier jusqu'\xE0 l'obtention du titre"
          ] }),
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }),
            " Ligne d'assistance prioritaire 7j/7 pour rassurer les parents"
          ] })
        ] }),
        /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: waLink("Bonjour Wicka, je souhaite r\xE9server le Pack VIP avec Navette A\xE9roport."),
            target: "_blank",
            rel: "noopener noreferrer",
            class: "btn-secondary btn-full",
            children: [
              /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp text-rose" }),
              " Choisir le Pack VIP & Navette"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("p", { class: "promo-disclaimer promo-disclaimer-center", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-circle-info" }),
      " Offre promotionnelle de lancement \xE0 dur\xE9e et places limit\xE9es. Les tarifs affich\xE9s sont susceptibles d'\xE9voluer \xE0 tout moment ; votre prix est bloqu\xE9 et garanti d\xE8s la signature du contrat."
    ] })
  ] }) })
] });

// src/pages/Contact.tsx
var contactMeta = {
  title: "Contact | \xC9tudier au Maroc avec Wicka Assistance",
  description: "Une question sur les \xE9tudes, l\u2019admission, le visa ou la vie \xE9tudiante au Maroc ? Contactez l\u2019\xE9quipe Wicka Assistance.",
  keywords: "contact \xE9tudes Maroc, conseiller \xE9tudiant Maroc, admission internationale, visa \xE9tudiant Maroc, orientation scolaire, Wicka Assistance"
};
var Contact = () => /* @__PURE__ */ jsxDEV("section", { class: "application-section brand-light-section", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
  /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
    /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-envelope" }),
      " Nous contacter"
    ] }),
    /* @__PURE__ */ jsxDEV("h1", { class: "section-title", children: "Parlons de votre projet" }),
    /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "Envoyez-nous votre demande." })
  ] }),
  /* @__PURE__ */ jsxDEV("div", { class: "app-form-box contact-box", children: /* @__PURE__ */ jsxDEV("form", { id: "contactForm", novalidate: true, children: [
    /* @__PURE__ */ jsxDEV("div", { class: "form-row-2", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
        /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "contactName", children: "Nom complet *" }),
        /* @__PURE__ */ jsxDEV("input", { class: "form-input", id: "contactName", name: "name", type: "text", minlength: 2, maxlength: 100, required: true }),
        /* @__PURE__ */ jsxDEV("small", { class: "field-message", "data-error-for": "contactName" })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
        /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "contactEmail", children: "Adresse e-mail *" }),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            class: "form-input",
            id: "contactEmail",
            name: "email",
            type: "email",
            maxlength: 160,
            autocomplete: "email",
            required: true
          }
        ),
        /* @__PURE__ */ jsxDEV("small", { class: "field-message", "data-error-for": "contactEmail" })
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "form-row-2", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
        /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "contactPhone", children: "T\xE9l\xE9phone / WhatsApp *" }),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            class: "form-input",
            id: "contactPhone",
            name: "phone",
            type: "tel",
            inputmode: "tel",
            maxlength: 25,
            placeholder: "+221 77 000 00 00",
            required: true
          }
        ),
        /* @__PURE__ */ jsxDEV("small", { class: "field-message", "data-error-for": "contactPhone" })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
        /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "contactSubject", children: "Sujet *" }),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            class: "form-input",
            id: "contactSubject",
            name: "subject",
            type: "text",
            minlength: 3,
            maxlength: 160,
            required: true
          }
        ),
        /* @__PURE__ */ jsxDEV("small", { class: "field-message", "data-error-for": "contactSubject" })
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "form-group", children: [
      /* @__PURE__ */ jsxDEV("label", { class: "form-label", for: "contactMessage", children: "Votre message *" }),
      /* @__PURE__ */ jsxDEV(
        "textarea",
        {
          class: "form-input",
          id: "contactMessage",
          name: "message",
          rows: 7,
          minlength: 10,
          maxlength: 4e3,
          required: true
        }
      ),
      /* @__PURE__ */ jsxDEV("small", { class: "field-message", "data-error-for": "contactMessage" })
    ] }),
    /* @__PURE__ */ jsxDEV("label", { class: "legal-consent", children: [
      /* @__PURE__ */ jsxDEV("input", { id: "contactConsent", name: "consent", value: "accepted", type: "checkbox", required: true }),
      " ",
      /* @__PURE__ */ jsxDEV("span", { children: [
        "J\u2019accepte que mes donn\xE9es soient utilis\xE9es pour r\xE9pondre \xE0 ma demande, conform\xE9ment \xE0 la",
        " ",
        /* @__PURE__ */ jsxDEV("a", { href: "/politique-confidentialite", children: "politique de confidentialit\xE9" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("button", { class: "btn-primary btn-full", type: "submit", id: "contactSubmit", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-paper-plane" }),
      " Envoyer mon message"
    ] }),
    /* @__PURE__ */ jsxDEV("p", { class: "form-status", id: "contactStatus", role: "status", "aria-live": "polite" })
  ] }) }),
  /* @__PURE__ */ jsxDEV("p", { class: "legal-back", children: /* @__PURE__ */ jsxDEV("a", { href: "/", children: [
    /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-left" }),
    " Retour \xE0 l\u2019accueil"
  ] }) })
] }) });

// src/pages/MentionsLegales.tsx
var mentionsLegalesMeta = {
  title: "Mentions l\xE9gales | Wicka Assistance",
  description: "Consultez les mentions l\xE9gales du site Wicka Assistance, service d\u2019orientation et d\u2019accompagnement pour les \xE9tudes au Maroc.",
  keywords: "mentions l\xE9gales Wicka Assistance, \xE9tudes Maroc, accompagnement \xE9tudiant"
};
var MentionsLegales = () => /* @__PURE__ */ jsxDEV("section", { class: "application-section brand-light-section", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
  /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
    /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-scale-balanced" }),
      " Informations l\xE9gales"
    ] }),
    /* @__PURE__ */ jsxDEV("h1", { class: "section-title", children: "Mentions l\xE9gales" }),
    /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "Les informations essentielles concernant le site Wicka Assistance." })
  ] }),
  /* @__PURE__ */ jsxDEV("article", { class: "app-form-box legal-content", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "\xC9diteur du site" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Le site Wicka Assistance est \xE9dit\xE9 par Wicka Assistance, service d\u2019accompagnement et d\u2019orientation pour les \xE9tudiants internationaux souhaitant \xE9tudier au Maroc." }),
    /* @__PURE__ */ jsxDEV("p", { children: [
      "Contact : ",
      /* @__PURE__ */ jsxDEV("a", { href: "mailto:wickaassistance@gmail.com", children: "wickaassistance@gmail.com" }),
      " \u2014",
      " ",
      /* @__PURE__ */ jsxDEV("a", { href: "https://wa.me/212789095498", children: "WhatsApp" }),
      "."
    ] }),
    /* @__PURE__ */ jsxDEV("h2", { children: "H\xE9bergement" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Le site est d\xE9ploy\xE9 sur l\u2019infrastructure Cloudflare Workers, avec mise en cache et distribution mondiale des ressources statiques. L\u2019h\xE9bergement peut \xE9voluer sans modifier les pr\xE9sentes informations essentielles. La version et le domaine effectivement utilis\xE9s sont ceux indiqu\xE9s dans la barre d\u2019adresse du navigateur." }),
    /* @__PURE__ */ jsxDEV("h2", { children: "Responsabilit\xE9" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Les informations publi\xE9es sont fournies \xE0 titre informatif. Wicka Assistance accompagne les d\xE9marches, mais ne garantit pas l\u2019admission, l\u2019obtention d\u2019un visa, d\u2019une bourse ou d\u2019un document administratif." }),
    /* @__PURE__ */ jsxDEV("p", { children: "Lorsque l\u2019\xE9tablissement demande un examen ou un concours d\u2019entr\xE9e, la d\xE9cision d\xE9pend de l\u2019\xE9tablissement et du r\xE9sultat obtenu par l\u2019\xE9tudiant." }),
    /* @__PURE__ */ jsxDEV("h2", { children: "Propri\xE9t\xE9 intellectuelle" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Les textes, \xE9l\xE9ments graphiques, logos et contenus du site ne peuvent pas \xEAtre reproduits ou r\xE9utilis\xE9s sans autorisation, sauf dispositions l\xE9gales applicables." }),
    /* @__PURE__ */ jsxDEV("p", { class: "legal-updated", children: "Derni\xE8re mise \xE0 jour : 15 octobre 2026." })
  ] }),
  /* @__PURE__ */ jsxDEV("p", { class: "legal-back", children: /* @__PURE__ */ jsxDEV("a", { href: "/", children: [
    /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-left" }),
    " Retour \xE0 l\u2019accueil"
  ] }) })
] }) });

// src/pages/PolitiqueConfidentialite.tsx
var politiqueConfidentialiteMeta = {
  title: "Politique de confidentialit\xE9 | Wicka Assistance",
  description: "D\xE9couvrez comment Wicka Assistance collecte, utilise et prot\xE8ge les donn\xE9es transmises via ses formulaires de contact et de candidature.",
  keywords: "politique confidentialit\xE9 \xE9tudiant, donn\xE9es personnelles, formulaires \xE9tudes Maroc, Wicka Assistance"
};
var PolitiqueConfidentialite = () => /* @__PURE__ */ jsxDEV("section", { class: "application-section brand-light-section", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
  /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
    /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-lock" }),
      " Vos donn\xE9es"
    ] }),
    /* @__PURE__ */ jsxDEV("h1", { class: "section-title", children: "Politique de confidentialit\xE9" }),
    /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "Une information claire sur l\u2019utilisation des donn\xE9es transmises par les formulaires." })
  ] }),
  /* @__PURE__ */ jsxDEV("article", { class: "app-form-box legal-content", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Donn\xE9es collect\xE9es" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Lorsque vous utilisez le formulaire de contact ou de candidature, nous pouvons recevoir les informations que vous saisissez : identit\xE9, coordonn\xE9es, pays, projet d\u2019\xE9tudes et pr\xE9f\xE9rences de suivi." }),
    /* @__PURE__ */ jsxDEV("h2", { children: "Finalit\xE9s" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Ces donn\xE9es servent uniquement \xE0 r\xE9pondre \xE0 votre demande, \xE9tudier votre projet, vous recontacter et vous envoyer la confirmation de r\xE9ception de votre message ou candidature." }),
    /* @__PURE__ */ jsxDEV("h2", { children: "Transmission et conservation" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Les messages peuvent \xEAtre transmis par l\u2019interm\xE9diaire du service d\u2019envoi d\u2019e-mails Brevo \xE0 l\u2019adresse de Wicka Assistance et \xE0 l\u2019adresse fournie par l\u2019utilisateur. Le site ne vend pas vos donn\xE9es et ne les utilise pas pour une finalit\xE9 \xE9trang\xE8re \xE0 votre demande." }),
    /* @__PURE__ */ jsxDEV("p", { children: "La dur\xE9e de conservation doit rester limit\xE9e au temps n\xE9cessaire au traitement et au suivi de la demande, sous r\xE9serve des obligations applicables." }),
    /* @__PURE__ */ jsxDEV("h2", { children: "Vos droits" }),
    /* @__PURE__ */ jsxDEV("p", { children: [
      "Vous pouvez demander l\u2019acc\xE8s, la rectification ou la suppression de vos donn\xE9es en \xE9crivant \xE0",
      " ",
      /* @__PURE__ */ jsxDEV("a", { href: "mailto:wickaassistance@gmail.com", children: "wickaassistance@gmail.com" }),
      "."
    ] }),
    /* @__PURE__ */ jsxDEV("h2", { children: "S\xE9curit\xE9" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Ne transmettez pas de document sensible ou de pi\xE8ce d\u2019identit\xE9 par le formulaire sans demande explicite d\u2019un conseiller. Les informations envoy\xE9es doivent \xEAtre exactes et limit\xE9es \xE0 ce qui est n\xE9cessaire." }),
    /* @__PURE__ */ jsxDEV("h2", { id: "cookies", children: "Cookies et stockage local" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Le site n\u2019utilise pas de cookie publicitaire, de cookie de suivi ou d\u2019outil d\u2019analyse comportementale. La banni\xE8re de confidentialit\xE9 m\xE9morise uniquement votre choix dans le stockage local de votre navigateur afin de ne pas vous \xEAtre pr\xE9sent\xE9e \xE0 chaque visite. Vous pouvez effacer cette pr\xE9f\xE9rence depuis les r\xE9glages de votre navigateur." }),
    /* @__PURE__ */ jsxDEV("p", { children: "Les ressources externes \xE9ventuellement charg\xE9es, comme la biblioth\xE8que d\u2019ic\xF4nes ou les polices, peuvent recevoir des informations techniques n\xE9cessaires \xE0 leur fonctionnement selon leurs propres politiques. Aucun service externe n\u2019est utilis\xE9 pour suivre votre navigation \xE0 des fins publicitaires." }),
    /* @__PURE__ */ jsxDEV("p", { class: "legal-updated", children: "Derni\xE8re mise \xE0 jour : 15 octobre 2026." })
  ] }),
  /* @__PURE__ */ jsxDEV("p", { class: "legal-back", children: /* @__PURE__ */ jsxDEV("a", { href: "/", children: [
    /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-left" }),
    " Retour \xE0 l\u2019accueil"
  ] }) })
] }) });

// src/pages/Cgv.tsx
var cgvMeta = {
  title: "Conditions g\xE9n\xE9rales | Wicka Assistance",
  description: "Consultez les conditions g\xE9n\xE9rales applicables aux services d\u2019orientation et d\u2019accompagnement propos\xE9s par Wicka Assistance.",
  keywords: "conditions g\xE9n\xE9rales Wicka Assistance, services \xE9tudes Maroc, accompagnement \xE9tudiant"
};
var Cgv = () => /* @__PURE__ */ jsxDEV("section", { class: "application-section brand-light-section", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
  /* @__PURE__ */ jsxDEV("div", { class: "section-header", children: [
    /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-file-contract" }),
      " Conditions de service"
    ] }),
    /* @__PURE__ */ jsxDEV("h1", { class: "section-title", children: "Conditions g\xE9n\xE9rales de vente" }),
    /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "Les r\xE8gles essentielles applicables aux services d\u2019accompagnement propos\xE9s." })
  ] }),
  /* @__PURE__ */ jsxDEV("article", { class: "app-form-box legal-content", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Objet" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Les pr\xE9sentes conditions encadrent les prestations d\u2019information, d\u2019orientation et d\u2019accompagnement administratif propos\xE9es par Wicka Assistance." }),
    /* @__PURE__ */ jsxDEV("h2", { children: "Nature de l\u2019accompagnement" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Wicka Assistance aide le client \xE0 pr\xE9parer son projet et ses d\xE9marches. L\u2019accompagnement ne remplace pas les d\xE9cisions des \xE9tablissements, administrations, ambassades ou autorit\xE9s comp\xE9tentes." }),
    /* @__PURE__ */ jsxDEV("h2", { children: "Absence de garantie d\u2019admission" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Aucune admission n\u2019est garantie \xE0 100 %. La d\xE9cision appartient \xE0 l\u2019\xE9tablissement concern\xE9. Lorsqu\u2019un examen ou un concours d\u2019entr\xE9e est demand\xE9, l\u2019\xE9tudiant doit le composer et satisfaire aux conditions fix\xE9es par l\u2019\xE9tablissement." }),
    /* @__PURE__ */ jsxDEV("p", { children: "Wicka Assistance ne peut pas \xEAtre tenue responsable d\u2019un refus d\u2019admission, d\u2019un r\xE9sultat d\u2019examen, d\u2019un refus de visa, d\u2019un retard administratif ou d\u2019une d\xE9cision prise par un tiers." }),
    /* @__PURE__ */ jsxDEV("h2", { children: "Prix et paiement" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Les prix et le contenu des formules sont ceux indiqu\xE9s au moment de la demande ou confirm\xE9s par \xE9crit par un conseiller. Toute prestation payante doit \xEAtre accept\xE9e avant son commencement." }),
    /* @__PURE__ */ jsxDEV("h2", { children: "Informations fournies par le client" }),
    /* @__PURE__ */ jsxDEV("p", { children: "Le client s\u2019engage \xE0 fournir des informations exactes, compl\xE8tes et \xE0 jour. Les retards ou refus r\xE9sultant d\u2019informations inexactes ou de documents manquants restent \xE0 sa charge." }),
    /* @__PURE__ */ jsxDEV("h2", { children: "R\xE9clamation" }),
    /* @__PURE__ */ jsxDEV("p", { children: [
      "Pour toute question ou r\xE9clamation, contactez Wicka Assistance \xE0",
      " ",
      /* @__PURE__ */ jsxDEV("a", { href: "mailto:wickaassistance@gmail.com", children: "wickaassistance@gmail.com" }),
      "."
    ] }),
    /* @__PURE__ */ jsxDEV("p", { class: "legal-updated", children: "Derni\xE8re mise \xE0 jour : 15 octobre 2026." })
  ] }),
  /* @__PURE__ */ jsxDEV("p", { class: "legal-back", children: /* @__PURE__ */ jsxDEV("a", { href: "/", children: [
    /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-left" }),
    " Retour \xE0 l\u2019accueil"
  ] }) })
] }) });

// src/pages/Merci.tsx
var merciMeta = {
  title: "Merci | Candidature re\xE7ue | Wicka Assistance",
  description: "Votre candidature a \xE9t\xE9 re\xE7ue par Wicka Assistance. Un conseiller reviendra vers vous pour la suite de votre projet d\u2019\xE9tudes au Maroc.",
  keywords: "candidature re\xE7ue, \xE9tudes Maroc, Wicka Assistance"
};
var thanksScript = `
    (function () {
      var data = null;
      try { data = JSON.parse(sessionStorage.getItem('wickaApplication') || 'null'); } catch (e) {}

      var recap = document.getElementById('thanksRecap');
      var title = document.getElementById('thanksTitle');
      var lead = document.getElementById('thanksLead');

      if (data && data.fullName) {
        var first = String(data.fullName).trim().split(' ')[0];
        if (first) title.innerHTML = 'Merci ' + first + ' ! \u{1F389}';
        lead.textContent = 'Votre candidature a bien \xE9t\xE9 transmise. Merci pour votre confiance.';

        recap.style.display = 'block';
        recap.innerHTML =
          '<div class="summary-row"><strong>Nom complet :</strong> <span>' + esc(data.fullName) + '</span></div>' +
          '<div class="summary-row"><strong>Pays :</strong> <span>' + esc(data.country) + '</span></div>' +
          '<div class="summary-row"><strong>Fili\xE8re vis\xE9e :</strong> <span>' + esc(data.studyDomain) + '</span></div>' +
          '<div class="summary-row"><strong>Universit\xE9 :</strong> <span>' + esc(data.targetUniversity) + '</span></div>' +
          '<div class="summary-row"><strong>Formule :</strong> <span>' + esc(data.selectedPack) + '</span></div>' +
          '<div class="summary-row"><strong>Navette a\xE9roport :</strong> <span>' + esc(data.airportTransfer) + '</span></div>';
      }

      function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
      }
    })();
  `;
var Merci = () => /* @__PURE__ */ jsxDEV(Fragment, { children: [
  /* @__PURE__ */ jsxDEV("div", { class: "thanks-page", children: /* @__PURE__ */ jsxDEV("section", { class: "thanks-main", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: /* @__PURE__ */ jsxDEV("div", { class: "thanks-card", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "thanks-check", children: /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check" }) }),
    /* @__PURE__ */ jsxDEV("h1", { id: "thanksTitle", children: "Merci ! \u{1F389}" }),
    /* @__PURE__ */ jsxDEV("p", { class: "lead", id: "thanksLead", children: "Votre candidature a bien \xE9t\xE9 enregistr\xE9e. Un conseiller Wicka Assistance vous contacte sous 24h." }),
    /* @__PURE__ */ jsxDEV("div", { class: "thanks-recap", id: "thanksRecap", style: "display:none;" }),
    /* @__PURE__ */ jsxDEV("div", { class: "thanks-steps", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "thanks-step", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "thanks-step-num", children: "1" }),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h4", { children: "Finalisez sur WhatsApp maintenant" }),
          /* @__PURE__ */ jsxDEV("p", { children: "Envoyez votre r\xE9cap \xE0 notre conseiller pour un traitement prioritaire et bloquer votre tarif promo \u221250%." })
        ] })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "thanks-step", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "thanks-step-num", children: "2" }),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h4", { children: "\xC9tude de votre dossier" }),
          /* @__PURE__ */ jsxDEV("p", { children: "Nous analysons votre profil et s\xE9lectionnons les meilleures universit\xE9s priv\xE9es pour vous." })
        ] })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "thanks-step", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "thanks-step-num", children: "3" }),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h4", { children: "Traitement de votre dossier" }),
          /* @__PURE__ */ jsxDEV("p", { children: "Vous recevez votre \xE9valuation et votre devis dans votre monnaie locale." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "thanks-actions", children: /* @__PURE__ */ jsxDEV("a", { href: "/", class: "btn-secondary btn-full", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-arrow-left" }),
      " ",
      /* @__PURE__ */ jsxDEV("span", { children: "Retour \xE0 l'accueil" })
    ] }) }),
    /* @__PURE__ */ jsxDEV("p", { class: "thanks-note", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-lock" }),
      " Vos donn\xE9es sont confidentielles et ne servent qu'aux d\xE9marches d'admission."
    ] })
  ] }) }) }) }),
  /* @__PURE__ */ jsxDEV("script", { dangerouslySetInnerHTML: { __html: thanksScript } })
] });

// src/pages/index.tsx
var pages = [
  { path: "/", priority: "1.0", changefreq: "monthly", structuredData: true, Component: Home, ...homeMeta },
  { path: "/candidature", priority: "0.9", changefreq: "monthly", Component: Candidature, ...candidatureMeta },
  { path: "/universites", priority: "0.8", changefreq: "monthly", Component: Universites, ...universitesMeta },
  { path: "/tarifs", priority: "0.8", changefreq: "monthly", Component: Tarifs, ...tarifsMeta },
  { path: "/contact", priority: "0.6", changefreq: "monthly", Component: Contact, ...contactMeta },
  { path: "/mentions-legales", priority: "0.2", changefreq: "monthly", Component: MentionsLegales, ...mentionsLegalesMeta },
  {
    path: "/politique-confidentialite",
    priority: "0.2",
    changefreq: "monthly",
    Component: PolitiqueConfidentialite,
    ...politiqueConfidentialiteMeta
  },
  { path: "/cgv", priority: "0.2", changefreq: "monthly", Component: Cgv, ...cgvMeta },
  { path: "/merci", priority: "0.1", changefreq: "never", noindex: true, Component: Merci, ...merciMeta }
];

// src/seo/robots.ts
function buildRobotsTxt(origin, pages2) {
  const blocked = pages2.filter((p) => p.noindex).map((p) => `Disallow: ${p.path}`);
  return ["User-agent: *", "Allow: /", "Disallow: /api/", ...blocked, "", `Sitemap: ${origin}/sitemap.xml`, ""].join("\n");
}

// src/seo/sitemap.ts
var xmlEscape = (value) => value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[ch]);
function buildSitemapXml(origin, pages2) {
  const urls = pages2.filter((p) => !p.noindex).map(
    (p) => `  <url><loc>${xmlEscape(origin + p.path)}</loc><priority>${p.priority}</priority><changefreq>${p.changefreq}</changefreq></url>`
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

// src/seo/llms.ts
var LLMS_PAGES = [
  { label: "Accueil", path: "/" },
  { label: "Candidature", path: "/candidature" },
  { label: "Formations et orientation", path: "/universites" },
  { label: "Tarifs", path: "/tarifs" },
  { label: "Contact", path: "/contact" },
  { label: "Politique de confidentialit\xE9", path: "/politique-confidentialite" },
  { label: "Mentions l\xE9gales", path: "/mentions-legales" },
  { label: "Conditions g\xE9n\xE9rales", path: "/cgv" }
];
function buildLlmsTxt(origin) {
  const pages2 = LLMS_PAGES.map((p) => `- [${p.label}](${origin}${p.path})`).join("\n");
  return `# ${SITE.name}

> ${SITE.name} accompagne les \xE9tudiants internationaux et leurs familles dans leur projet d'\xE9tudes au Maroc.

## Pages publiques

${pages2}

## R\xE8gles

Utiliser uniquement les informations publiques du site. Ne pas inventer de tarifs, de garanties d'admission ou de d\xE9cisions administratives.
`;
}

// src/routes/seo.ts
var seo = new Hono3();
var CACHE = "public, max-age=300";
seo.get(
  "/sitemap.xml",
  (c) => c.body(buildSitemapXml(c.get("origin"), pages), 200, {
    "content-type": "application/xml; charset=UTF-8",
    "cache-control": CACHE
  })
);
seo.get(
  "/robots.txt",
  (c) => c.body(buildRobotsTxt(c.get("origin"), pages), 200, {
    "content-type": "text/plain; charset=UTF-8",
    "cache-control": CACHE
  })
);
seo.get(
  "/llms.txt",
  (c) => c.body(buildLlmsTxt(c.get("origin")), 200, {
    "content-type": "text/plain; charset=UTF-8",
    "cache-control": CACHE
  })
);

// src/routes/send-email.ts
var BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
var BRAND = {
  rose: "#9f1239",
  roseDark: "#881337",
  gold: "#f59e0b",
  ink: "#1f2937",
  muted: "#64748b",
  light: "#fff1f2",
  cream: "#fff7ed",
  border: "#ffe4e6"
};
function text(value, max = 4e3) {
  return String(value ?? "").trim().slice(0, max);
}
function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text(value, 160));
}
function validPhone(value) {
  const raw2 = text(value, 40);
  const digits = raw2.replace(/\D/g, "");
  return /^[+\d\s().-]+$/.test(raw2) && digits.length >= 8 && digits.length <= 15;
}
function escapeHtml(value) {
  return text(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}
function requiredText(value, label, max = 4e3) {
  const result = text(value, max);
  if (!result) throw new Error(`${label} est obligatoire.`);
  return result;
}
function config(env2) {
  const required = ["BREVO_API_KEY", "BREVO_FROM_EMAIL", "BREVO_COMPANY_EMAIL"];
  const missing = required.filter((key) => !env2[key]);
  if (missing.length) throw new Error(`Configuration Brevo manquante: ${missing.join(", ")}`);
  if (!validEmail(env2.BREVO_FROM_EMAIL) || !validEmail(env2.BREVO_COMPANY_EMAIL)) {
    throw new Error("Configuration Brevo invalide: v\xE9rifiez les adresses e-mail.");
  }
  const siteUrl = text(env2.PUBLIC_SITE_URL, 300).replace(/\/$/, "");
  return {
    apiKey: env2.BREVO_API_KEY,
    fromEmail: text(env2.BREVO_FROM_EMAIL, 160),
    fromName: text(env2.BREVO_FROM_NAME, 80) || "Wicka Assistance",
    companyEmail: text(env2.BREVO_COMPANY_EMAIL, 160),
    logoUrl: text(env2.BREVO_LOGO_URL, 500) || (siteUrl ? `${siteUrl}/assets/images/logo.png` : "")
  };
}
function emailLayout(title2, content, cfg) {
  const logo = cfg.logoUrl ? `<img src="${escapeHtml(cfg.logoUrl)}" alt="Wicka Assistance" style="display:block;width:120px;height:98px;max-width:100%;margin:0 auto 22px;object-fit:contain;">` : `<div style="font-size:24px;font-weight:800;letter-spacing:.08em;color:${BRAND.rose};margin-bottom:22px;">WICKA<span style="color:${BRAND.gold};">.</span></div>`;
  return `<!doctype html><html lang="fr"><body style="margin:0;background:${BRAND.light};font-family:Arial,Helvetica,sans-serif;color:${BRAND.ink};"><div style="padding:28px 12px;"><div style="max-width:650px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(136,19,55,.10);"><div style="height:6px;background:linear-gradient(90deg,${BRAND.rose},${BRAND.gold});"></div><div style="padding:34px 30px 28px;text-align:center;">${logo}<h1 style="margin:0;color:${BRAND.roseDark};font-size:23px;line-height:1.3;">${escapeHtml(title2)}</h1></div><div style="padding:0 30px 30px;font-size:15px;line-height:1.7;">${content}</div><div style="padding:18px 30px;background:${BRAND.cream};border-top:1px solid ${BRAND.border};text-align:center;color:${BRAND.muted};font-size:12px;">Wicka Assistance \xB7 \xC9tudes et accompagnement au Maroc<br><a href="mailto:${escapeHtml(cfg.companyEmail)}" style="color:${BRAND.rose};">${escapeHtml(cfg.companyEmail)}</a></div></div></div></body></html>`;
}
async function sendBrevo({ to, subject, html: html2, replyTo }, cfg) {
  const payload = {
    sender: { name: cfg.fromName, email: cfg.fromEmail },
    to: [{ email: to }],
    subject,
    htmlContent: html2
  };
  if (replyTo && validEmail(replyTo)) payload.replyTo = { email: replyTo };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8e3);
  let response;
  try {
    response = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: { accept: "application/json", "api-key": cfg.apiKey, "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    const detail = await response.text();
    console.error("[brevo] API error", response.status, detail.slice(0, 500));
    throw new Error("Le service e-mail est temporairement indisponible.");
  }
}
function validateCommon(body) {
  const email = text(body.email, 160);
  const phone = text(body.phone || body.whatsapp, 40);
  if (!email || !validEmail(email)) throw new Error("Adresse e-mail invalide.");
  if (!phone || !validPhone(phone)) throw new Error("Num\xE9ro de t\xE9l\xE9phone invalide.");
  return { email, phone };
}
function detailRows(labels) {
  return labels.map(
    ([label, value]) => `<p style="margin:0 0 8px;"><strong style="color:${BRAND.roseDark};">${escapeHtml(label)} :</strong> ${escapeHtml(value)}</p>`
  ).join("");
}
function contactEmails(body, cfg) {
  const { email, phone } = validateCommon(body);
  const name = requiredText(body.name, "Le nom", 100);
  const subject = requiredText(body.subject, "Le sujet", 160);
  const message = requiredText(body.message, "Le message", 4e3);
  if (name.length < 2 || subject.length < 3 || message.length < 10) throw new Error("Les champs du contact sont incomplets.");
  const details = detailRows([
    ["Nom", name],
    ["E-mail", email],
    ["T\xE9l\xE9phone", phone],
    ["Sujet", subject],
    ["Message", message]
  ]);
  return {
    company: {
      to: cfg.companyEmail,
      subject: `[Contact] ${subject}`,
      html: emailLayout("Nouveau message de contact", details, cfg),
      replyTo: email
    },
    user: {
      to: email,
      subject: "Votre message a bien \xE9t\xE9 re\xE7u \u2014 Wicka Assistance",
      html: emailLayout(
        "Merci pour votre message",
        `<p>Bonjour ${escapeHtml(name)},</p><p>Nous avons bien re\xE7u votre message. Notre \xE9quipe Wicka Assistance reviendra vers vous d\xE8s que possible.</p><hr style="border:0;border-top:1px solid ${BRAND.border};margin:24px 0;">${details}<p>Merci,<br><strong>Wicka Assistance</strong></p>`,
        cfg
      )
    }
  };
}
function candidatureEmails(body, cfg) {
  const { email, phone } = validateCommon(body);
  const name = requiredText(body.fullName, "Le nom complet", 120);
  const fields = [
    ["Pays", body.country, "Le pays"],
    ["Niveau d\u2019\xE9tudes", body.currentLevel, "Le niveau d\u2019\xE9tudes"],
    ["S\xE9rie du bac", body.bacSeries, "La s\xE9rie du bac"],
    ["Fili\xE8re souhait\xE9e", body.studyDomain, "La fili\xE8re"],
    ["Ville souhait\xE9e", body.targetCity, "La ville souhait\xE9e"],
    ["Formule", body.selectedPack, "La formule"],
    ["Navette a\xE9roport", body.airportTransfer, "Le choix de navette"]
  ];
  fields.forEach(([, value, label]) => requiredText(value, label, 300));
  const details = detailRows([
    ["Nom complet", name],
    ...fields.map(([label, value]) => [label, text(value)]),
    ["WhatsApp", phone],
    ["E-mail", email],
    ["Universit\xE9 souhait\xE9e", text(body.targetUniversity, 200) || "Recommandation Wicka"],
    ["Notes", text(body.notes, 4e3) || "Aucune"]
  ]);
  const disclaimer = `<p style="padding:14px 16px;background:${BRAND.light};border-left:4px solid ${BRAND.rose};">Cette confirmation ne constitue pas une garantie d\u2019admission. La d\xE9cision appartient \xE0 l\u2019\xE9tablissement et, lorsqu\u2019un examen est demand\xE9, au r\xE9sultat de l\u2019\xE9tudiant.</p>`;
  return {
    company: {
      to: cfg.companyEmail,
      subject: `[Candidature] ${name}`,
      html: emailLayout("Nouvelle candidature", details, cfg),
      replyTo: email
    },
    user: {
      to: email,
      subject: "Votre candidature a bien \xE9t\xE9 re\xE7ue \u2014 Wicka Assistance",
      html: emailLayout(
        "Candidature re\xE7ue",
        `<p>Bonjour ${escapeHtml(name)},</p><p>Nous confirmons la bonne r\xE9ception de votre candidature par Wicka Assistance.</p>${disclaimer}<hr style="border:0;border-top:1px solid ${BRAND.border};margin:24px 0;">${details}<p>Merci,<br><strong>Wicka Assistance</strong></p>`,
        cfg
      )
    }
  };
}
function callbackEmail(body, cfg) {
  const phone = text(body.phone, 40);
  if (!phone || !validPhone(phone)) throw new Error("Num\xE9ro de t\xE9l\xE9phone invalide.");
  const name = text(body.name, 100) || "Non renseign\xE9";
  const details = detailRows([
    ["Nom", name],
    ["Num\xE9ro WhatsApp / t\xE9l\xE9phone", phone]
  ]);
  return {
    to: cfg.companyEmail,
    subject: "[Rappel demand\xE9] Nouvelle demande",
    html: emailLayout(
      "Nouvelle demande de rappel",
      `<p>Un visiteur souhaite \xEAtre rappel\xE9 par un conseiller Wicka Assistance.</p>${details}<p>Merci de contacter ce num\xE9ro dans le d\xE9lai annonc\xE9.</p>`,
      cfg
    )
  };
}
async function sendEmailHandler(c) {
  try {
    const contentLength = Number(c.req.header("content-length") || 0);
    if (contentLength > 5e4) return c.json({ error: "Requ\xEAte trop volumineuse." }, 413);
    const body = await c.req.json().catch(() => ({}));
    if (body.website) return c.json({ ok: true });
    const cfg = config(getEnv(c));
    const type = text(body.type, 20);
    if ((type === "contact" || type === "candidature") && body.consent !== "accepted") {
      return c.json({ error: "Le consentement est obligatoire." }, 400);
    }
    if (type === "callback") {
      await sendBrevo(callbackEmail(body, cfg), cfg);
      return c.json({ ok: true });
    }
    const emails = type === "contact" ? contactEmails(body, cfg) : type === "candidature" ? candidatureEmails(body, cfg) : null;
    if (!emails) return c.json({ error: "Type de formulaire inconnu." }, 400);
    await sendBrevo(emails.company, cfg);
    await sendBrevo(emails.user, cfg);
    return c.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[send-email]", message);
    const isClientError = /Adresse|Numéro|obligatoire|incomplets|inconnu|trop volumineuse/.test(message);
    const status = isClientError ? 400 : 502;
    return c.json({ error: isClientError ? message : "Le service est temporairement indisponible." }, status);
  }
}

// src/pages/NotFound.tsx
var notFoundMeta = {
  title: "Page introuvable | Wicka Assistance",
  description: "La page demand\xE9e n'existe pas ou a \xE9t\xE9 d\xE9plac\xE9e. Retrouvez nos universit\xE9s, nos tarifs ou contactez un conseiller Wicka Assistance."
};
var NotFound = () => /* @__PURE__ */ jsxDEV("section", { class: "notfound-section", id: "page-introuvable", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: /* @__PURE__ */ jsxDEV("div", { class: "notfound-card", children: [
  /* @__PURE__ */ jsxDEV("span", { class: "section-badge", children: [
    /* @__PURE__ */ jsxDEV("i", { class: "fas fa-compass" }),
    " Erreur 404"
  ] }),
  /* @__PURE__ */ jsxDEV("div", { class: "notfound-code", children: "404" }),
  /* @__PURE__ */ jsxDEV("h1", { class: "section-title", children: "Page introuvable" }),
  /* @__PURE__ */ jsxDEV("p", { class: "section-subtitle", children: "La page que vous cherchez n'existe pas ou a \xE9t\xE9 d\xE9plac\xE9e. Retournez \xE0 l'accueil, explorez nos universit\xE9s ou \xE9changez directement avec un conseiller." }),
  /* @__PURE__ */ jsxDEV("div", { class: "notfound-actions", children: [
    /* @__PURE__ */ jsxDEV("a", { href: "/", class: "btn-primary", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-house" }),
      /* @__PURE__ */ jsxDEV("span", { children: "Retour \xE0 l'accueil" })
    ] }),
    /* @__PURE__ */ jsxDEV("a", { href: "/universites", class: "btn-secondary", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-university" }),
      /* @__PURE__ */ jsxDEV("span", { children: "Voir les universit\xE9s" })
    ] }),
    /* @__PURE__ */ jsxDEV(
      "a",
      {
        href: waLink("Bonjour Wicka Assistance, je souhaite des informations pour \xE9tudier au Maroc."),
        target: "_blank",
        rel: "noopener noreferrer",
        class: "btn-secondary",
        children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp text-rose" }),
          /* @__PURE__ */ jsxDEV("span", { children: "WhatsApp" })
        ]
      }
    )
  ] })
] }) }) });

// src/seo/jsonld.ts
function organizationJsonLd(origin) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE.name,
    url: `${origin}/`,
    logo: `${origin}${SITE.logo}`,
    description: "Orientation et accompagnement des \xE9tudiants internationaux pour leurs \xE9tudes au Maroc.",
    areaServed: ["Maroc", "Afrique de l\u2019Ouest", "Afrique centrale", "France"],
    availableLanguage: ["fr"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: SITE.email,
      telephone: `+${SITE.phoneRaw}`,
      availableLanguage: "French"
    },
    sameAs: [`https://wa.me/${SITE.phoneRaw}`]
  };
}

// src/layout/Head.tsx
var Head = ({ origin, path, title: title2, description, keywords, noindex, structuredData = false, canonical: withCanonical = true }) => {
  const canonical = `${origin}${path}`;
  const image = `${origin}${SITE.ogImage}`;
  return /* @__PURE__ */ jsxDEV("head", { children: [
    /* @__PURE__ */ jsxDEV("meta", { charset: "UTF-8" }),
    /* @__PURE__ */ jsxDEV("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
    /* @__PURE__ */ jsxDEV("title", { children: title2 }),
    /* @__PURE__ */ jsxDEV("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsxDEV("meta", { name: "keywords", content: keywords ?? SITE.defaultKeywords }),
    /* @__PURE__ */ jsxDEV("meta", { name: "author", content: SITE.name }),
    /* @__PURE__ */ jsxDEV("meta", { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" }),
    /* @__PURE__ */ jsxDEV("meta", { name: "theme-color", content: SITE.themeColor }),
    /* @__PURE__ */ jsxDEV("link", { rel: "icon", type: "image/png", href: SITE.logo }),
    /* @__PURE__ */ jsxDEV("link", { rel: "apple-touch-icon", href: SITE.logo }),
    /* @__PURE__ */ jsxDEV("meta", { property: "og:type", content: "website" }),
    /* @__PURE__ */ jsxDEV("meta", { property: "og:site_name", content: SITE.name }),
    /* @__PURE__ */ jsxDEV("meta", { property: "og:locale", content: SITE.locale }),
    /* @__PURE__ */ jsxDEV("meta", { property: "og:title", content: title2 }),
    /* @__PURE__ */ jsxDEV("meta", { property: "og:description", content: description }),
    withCanonical && /* @__PURE__ */ jsxDEV("meta", { property: "og:url", content: canonical }),
    /* @__PURE__ */ jsxDEV("meta", { property: "og:image", content: image }),
    /* @__PURE__ */ jsxDEV("meta", { property: "og:image:secure_url", content: image }),
    /* @__PURE__ */ jsxDEV("meta", { property: "og:image:type", content: "image/jpeg" }),
    /* @__PURE__ */ jsxDEV("meta", { property: "og:image:alt", content: "\xC9tudiants internationaux pr\xE9parant leurs \xE9tudes au Maroc" }),
    /* @__PURE__ */ jsxDEV("meta", { property: "og:image:width", content: "1200" }),
    /* @__PURE__ */ jsxDEV("meta", { property: "og:image:height", content: "630" }),
    /* @__PURE__ */ jsxDEV("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsxDEV("meta", { name: "twitter:title", content: title2 }),
    /* @__PURE__ */ jsxDEV("meta", { name: "twitter:description", content: description }),
    /* @__PURE__ */ jsxDEV("meta", { name: "twitter:image", content: image }),
    withCanonical && /* @__PURE__ */ jsxDEV("link", { rel: "canonical", href: canonical }),
    /* @__PURE__ */ jsxDEV(
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap",
        rel: "stylesheet"
      }
    ),
    /* @__PURE__ */ jsxDEV(
      "link",
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
        integrity: "sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==",
        crossorigin: "anonymous",
        referrerpolicy: "no-referrer"
      }
    ),
    /* @__PURE__ */ jsxDEV("link", { rel: "stylesheet", href: "/css/style.css" }),
    /* @__PURE__ */ jsxDEV("link", { rel: "stylesheet", href: "/css/responsive.css" }),
    structuredData && /* @__PURE__ */ jsxDEV("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(organizationJsonLd(origin)) } })
  ] });
};

// src/layout/Header.tsx
var Brand = () => /* @__PURE__ */ jsxDEV(Fragment, { children: [
  /* @__PURE__ */ jsxDEV("img", { class: "brand-image", src: SITE.logo, alt: SITE.name, width: "52", height: "44" }),
  /* @__PURE__ */ jsxDEV("div", { class: "brand-text-wrap", children: [
    /* @__PURE__ */ jsxDEV("span", { class: "brand-title", children: [
      "WICKA",
      /* @__PURE__ */ jsxDEV("span", { class: "text-rose", children: "." })
    ] }),
    /* @__PURE__ */ jsxDEV("span", { class: "brand-subtitle", children: SITE.tagline })
  ] })
] });
var Header = ({ path }) => /* @__PURE__ */ jsxDEV(Fragment, { children: [
  /* @__PURE__ */ jsxDEV("div", { class: "top-notice-bar", children: /* @__PURE__ */ jsxDEV("div", { class: "container notice-content", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "notice-left", children: [
      /* @__PURE__ */ jsxDEV("span", { class: "notice-tag", children: SITE.promo.tag }),
      /* @__PURE__ */ jsxDEV("span", { children: SITE.promo.text })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "notice-right", children: [
      /* @__PURE__ */ jsxDEV("a", { href: waLink(), target: "_blank", rel: "noopener noreferrer", class: "notice-contact", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp text-rose-300" }),
        " WhatsApp"
      ] }),
      /* @__PURE__ */ jsxDEV("a", { href: `mailto:${SITE.email}`, class: "notice-contact", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "far fa-envelope" }),
        " ",
        SITE.email
      ] })
    ] })
  ] }) }),
  /* @__PURE__ */ jsxDEV("header", { class: "site-header", id: "siteHeader", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: /* @__PURE__ */ jsxDEV("nav", { class: "navbar", "aria-label": "Navigation principale", children: [
    /* @__PURE__ */ jsxDEV("a", { href: "/", class: "brand-logo", children: /* @__PURE__ */ jsxDEV(Brand, {}) }),
    /* @__PURE__ */ jsxDEV("ul", { class: "nav-links", children: NAV_LINKS.map((link2) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("a", { href: link2.href, class: link2.href === path ? "nav-link active" : "nav-link", children: link2.label }) })) }),
    /* @__PURE__ */ jsxDEV("div", { class: "nav-actions", children: [
      /* @__PURE__ */ jsxDEV("button", { type: "button", class: "nav-callback-btn", id: "triggerCallbackModal", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-phone-alt" }),
        /* @__PURE__ */ jsxDEV("span", { children: "\xCAtre Rappel\xE9" })
      ] }),
      /* @__PURE__ */ jsxDEV("a", { href: "/candidature", class: "btn-primary btn-sm", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-paper-plane" }),
        /* @__PURE__ */ jsxDEV("span", { children: "Postuler" })
      ] }),
      /* @__PURE__ */ jsxDEV("button", { type: "button", class: "mobile-menu-toggle", id: "mobileMenuToggle", "aria-label": "Ouvrir le menu", children: /* @__PURE__ */ jsxDEV("i", { class: "fas fa-bars" }) })
    ] })
  ] }) }) }),
  /* @__PURE__ */ jsxDEV("div", { class: "mobile-menu-drawer", id: "mobileMenu", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "drawer-header", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "brand-logo", children: /* @__PURE__ */ jsxDEV(Brand, {}) }),
      /* @__PURE__ */ jsxDEV("button", { type: "button", class: "drawer-close-btn", id: "mobileMenuClose", "aria-label": "Fermer le menu", children: "\xD7" })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { class: "mobile-nav-links", children: NAV_LINKS.map((link2) => /* @__PURE__ */ jsxDEV("a", { href: link2.href, class: "mobile-nav-link", children: [
      link2.label,
      " ",
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-chevron-right" })
    ] })) }),
    /* @__PURE__ */ jsxDEV("div", { style: "margin-top: auto; display: flex; flex-direction: column; gap: 12px;", children: [
      /* @__PURE__ */ jsxDEV("a", { href: "/candidature", class: "btn-primary btn-full mobile-nav-link", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fas fa-paper-plane" }),
        " D\xE9marrer ma Candidature"
      ] }),
      /* @__PURE__ */ jsxDEV("a", { href: waLink(), target: "_blank", rel: "noopener noreferrer", class: "btn-secondary btn-full", children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp text-rose" }),
        " WhatsApp"
      ] })
    ] })
  ] })
] });

// src/layout/Footer.tsx
var Footer = () => /* @__PURE__ */ jsxDEV("footer", { class: "site-footer", children: /* @__PURE__ */ jsxDEV("div", { class: "container", children: [
  /* @__PURE__ */ jsxDEV("div", { class: "footer-grid", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "footer-brand", children: [
      /* @__PURE__ */ jsxDEV("div", { class: "brand-logo", children: [
        /* @__PURE__ */ jsxDEV("img", { class: "brand-image", src: SITE.logo, alt: SITE.name, width: "52", height: "44" }),
        /* @__PURE__ */ jsxDEV("div", { class: "brand-text-wrap", children: [
          /* @__PURE__ */ jsxDEV("span", { class: "brand-title", children: [
            "WICKA",
            /* @__PURE__ */ jsxDEV("span", { class: "text-rose", children: "." })
          ] }),
          /* @__PURE__ */ jsxDEV("span", { class: "brand-subtitle", children: SITE.tagline })
        ] })
      ] }),
      /* @__PURE__ */ jsxDEV("p", { children: "Cabinet d'orientation, d'admission en grandes \xE9coles priv\xE9es et de navette VIP pour les \xE9tudiants internationaux au Maroc." }),
      /* @__PURE__ */ jsxDEV("div", { class: "footer-social-links", children: [
        SOCIAL_LINKS.map((s) => /* @__PURE__ */ jsxDEV("a", { href: s.href, class: "social-icon-btn", "aria-label": s.label, children: /* @__PURE__ */ jsxDEV("i", { class: s.icon }) })),
        /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: waLink(),
            target: "_blank",
            rel: "noopener noreferrer",
            class: "social-icon-btn",
            "aria-label": "WhatsApp",
            children: /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h4", { class: "footer-col-title", children: "Navigation" }),
      /* @__PURE__ */ jsxDEV("ul", { class: "footer-links-list", children: FOOTER_LINKS.map((l) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("a", { href: l.href, children: l.label }) })) })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h4", { class: "footer-col-title", children: "Grandes \xC9coles Priv\xE9es" }),
      /* @__PURE__ */ jsxDEV("ul", { class: "footer-links-list", children: FOOTER_SCHOOLS.map((l) => /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("a", { href: l.href, children: l.label }) })) })
    ] }),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h4", { class: "footer-col-title", children: "Contact & Bureaux au Maroc" }),
      /* @__PURE__ */ jsxDEV("div", { class: "footer-contact-info", children: [
        SITE.offices.map((o) => /* @__PURE__ */ jsxDEV("div", { class: "contact-line", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-map-marker-alt" }),
          /* @__PURE__ */ jsxDEV("span", { children: [
            /* @__PURE__ */ jsxDEV("strong", { children: [
              o.city,
              " :"
            ] }),
            " ",
            o.address
          ] })
        ] })),
        /* @__PURE__ */ jsxDEV("div", { class: "contact-line", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
          /* @__PURE__ */ jsxDEV("a", { href: waLink(), target: "_blank", rel: "noopener noreferrer", children: "WhatsApp" })
        ] }),
        /* @__PURE__ */ jsxDEV("div", { class: "contact-line", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "far fa-envelope" }),
          /* @__PURE__ */ jsxDEV("span", { children: SITE.email })
        ] })
      ] })
    ] })
  ] }),
  /* @__PURE__ */ jsxDEV("div", { class: "footer-bottom-bar", children: /* @__PURE__ */ jsxDEV("span", { children: [
    "\xA9 ",
    SITE.copyrightYear,
    " ",
    SITE.name,
    ". Tous droits r\xE9serv\xE9s."
  ] }) })
] }) });

// src/layout/FloatingActions.tsx
var FloatingActions = () => /* @__PURE__ */ jsxDEV(Fragment, { children: [
  /* @__PURE__ */ jsxDEV(
    "a",
    {
      href: waLink("Bonjour Wicka Assistance, je souhaite des informations pour \xE9tudier au Maroc."),
      target: "_blank",
      rel: "noopener noreferrer",
      class: "floating-whatsapp-btn",
      "aria-label": "Contacter sur WhatsApp",
      children: [
        /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
        /* @__PURE__ */ jsxDEV("span", { class: "wa-badge-online", title: "Conseiller WhatsApp en ligne" })
      ]
    }
  ),
  /* @__PURE__ */ jsxDEV("div", { class: "mobile-sticky-cta", children: [
    /* @__PURE__ */ jsxDEV("a", { href: "/candidature", class: "msc-btn msc-primary", children: [
      /* @__PURE__ */ jsxDEV("i", { class: "fas fa-paper-plane" }),
      " ",
      SITE.promo.stickyLabel
    ] }),
    /* @__PURE__ */ jsxDEV(
      "a",
      {
        href: waLink("Bonjour Wicka, je souhaite des infos pour \xE9tudier au Maroc."),
        target: "_blank",
        rel: "noopener noreferrer",
        class: "msc-btn msc-wa",
        children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
          " WhatsApp"
        ]
      }
    )
  ] }),
  /* @__PURE__ */ jsxDEV("div", { class: "modal-wrapper", id: "callbackModal", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "modal-backdrop" }),
    /* @__PURE__ */ jsxDEV("div", { class: "modal-card", children: [
      /* @__PURE__ */ jsxDEV("button", { type: "button", class: "modal-close-btn", "aria-label": "Fermer", children: "\xD7" }),
      /* @__PURE__ */ jsxDEV("div", { class: "modal-icon-success", children: /* @__PURE__ */ jsxDEV("i", { class: "fas fa-phone-volume" }) }),
      /* @__PURE__ */ jsxDEV("h3", { style: "font-size: 1.4rem; margin-bottom: 8px;", children: "\xCAtre Rappel\xE9 par un Conseiller" }),
      /* @__PURE__ */ jsxDEV("p", { style: "font-size: 0.9rem; color: var(--slate-600); margin-bottom: 24px;", children: "Indiquez votre num\xE9ro WhatsApp pour qu'un conseiller d'orientation vous contacte sous 30 minutes." }),
      /* @__PURE__ */ jsxDEV("form", { id: "callbackQuickForm", children: [
        /* @__PURE__ */ jsxDEV("div", { class: "form-group", style: "text-align: left;", children: [
          /* @__PURE__ */ jsxDEV("label", { class: "form-label", style: "font-size: 0.85rem;", children: "Votre Num\xE9ro WhatsApp avec indicatif :" }),
          /* @__PURE__ */ jsxDEV("input", { type: "tel", class: "form-input", placeholder: "Ex: +221 77... ou +225 07...", required: true })
        ] }),
        /* @__PURE__ */ jsxDEV("button", { type: "submit", class: "btn-primary btn-full", children: [
          /* @__PURE__ */ jsxDEV("i", { class: "fas fa-headset" }),
          " Demander \xE0 \xEAtre Rappel\xE9"
        ] })
      ] })
    ] })
  ] }),
  /* @__PURE__ */ jsxDEV("div", { class: "modal-wrapper", id: "successModal", children: [
    /* @__PURE__ */ jsxDEV("div", { class: "modal-backdrop" }),
    /* @__PURE__ */ jsxDEV("div", { class: "modal-card", style: "max-width: 580px;", children: [
      /* @__PURE__ */ jsxDEV("button", { type: "button", class: "modal-close-btn", "aria-label": "Fermer", children: "\xD7" }),
      /* @__PURE__ */ jsxDEV("div", { class: "modal-icon-success", style: "background-color: var(--success-bg); color: var(--success);", children: /* @__PURE__ */ jsxDEV("i", { class: "fas fa-check-circle" }) }),
      /* @__PURE__ */ jsxDEV("h3", { style: "font-size: 1.5rem; margin-bottom: 8px;", children: "Candidature Enregistr\xE9e avec Succ\xE8s !" }),
      /* @__PURE__ */ jsxDEV("p", { style: "font-size: 0.9rem; color: var(--slate-600);", children: [
        "F\xE9licitations ! Votre dossier a \xE9t\xE9 transmis aux conseillers de ",
        SITE.name,
        "."
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "modal-student-summary", id: "modalStudentSummary" }),
      /* @__PURE__ */ jsxDEV("div", { style: "display: flex; flex-direction: column; gap: 12px;", children: [
        /* @__PURE__ */ jsxDEV(
          "a",
          {
            id: "modalWhatsappRedirect",
            href: "#",
            target: "_blank",
            rel: "noopener noreferrer",
            class: "btn-primary btn-full",
            style: "background: #25D366; border-color: #25D366;",
            children: [
              /* @__PURE__ */ jsxDEV("i", { class: "fab fa-whatsapp" }),
              /* @__PURE__ */ jsxDEV("span", { children: "WhatsApp" })
            ]
          }
        ),
        /* @__PURE__ */ jsxDEV("button", { type: "button", class: "btn-secondary btn-full modal-close-btn-action", children: /* @__PURE__ */ jsxDEV("span", { children: "Fermer cette fen\xEAtre" }) })
      ] })
    ] })
  ] })
] });

// src/layout/CookieBanner.tsx
var CookieBanner = () => /* @__PURE__ */ jsxDEV(
  "aside",
  {
    class: "cookie-banner",
    "data-cookie-banner": true,
    role: "dialog",
    "aria-labelledby": "cookie-title",
    "aria-describedby": "cookie-description",
    hidden: true,
    children: [
      /* @__PURE__ */ jsxDEV("div", { class: "cookie-banner-content", children: [
        /* @__PURE__ */ jsxDEV("p", { class: "cookie-banner-title", id: "cookie-title", children: "Votre confidentialit\xE9 compte" }),
        /* @__PURE__ */ jsxDEV("p", { id: "cookie-description", children: "Nous utilisons uniquement le stockage local n\xE9cessaire pour m\xE9moriser votre choix. Aucun cookie publicitaire ou outil de suivi n\u2019est install\xE9." }),
        /* @__PURE__ */ jsxDEV("a", { href: "/politique-confidentialite#cookies", children: "En savoir plus" })
      ] }),
      /* @__PURE__ */ jsxDEV("div", { class: "cookie-banner-actions", children: [
        /* @__PURE__ */ jsxDEV("button", { type: "button", class: "btn-secondary cookie-choice", "data-cookie-choice": "reject", children: "Refuser" }),
        /* @__PURE__ */ jsxDEV("button", { type: "button", class: "btn-primary cookie-choice", "data-cookie-choice": "accept", children: "Accepter" })
      ] })
    ]
  }
);

// src/layout/Layout.tsx
var Layout = ({ origin, path, title: title2, description, keywords, noindex, structuredData, canonical, children }) => /* @__PURE__ */ jsxDEV("html", { lang: "fr", children: [
  /* @__PURE__ */ jsxDEV(
    Head,
    {
      origin,
      path,
      title: title2,
      description,
      keywords,
      noindex,
      structuredData,
      canonical
    }
  ),
  /* @__PURE__ */ jsxDEV("body", { children: [
    /* @__PURE__ */ jsxDEV(Header, { path }),
    /* @__PURE__ */ jsxDEV("main", { children }),
    /* @__PURE__ */ jsxDEV(Footer, {}),
    /* @__PURE__ */ jsxDEV(FloatingActions, {}),
    /* @__PURE__ */ jsxDEV("script", { src: "/js/data.js" }),
    /* @__PURE__ */ jsxDEV("script", { src: "/js/main.js" }),
    /* @__PURE__ */ jsxDEV(CookieBanner, {})
  ] })
] });

// src/app.tsx
var app = new Hono3();
var renderPage = ({ Component, ...meta2 }) => /* @__PURE__ */ jsxDEV(Fragment, { children: [
  raw("<!DOCTYPE html>"),
  /* @__PURE__ */ jsxDEV(Layout, { ...meta2, children: /* @__PURE__ */ jsxDEV(Component, {}) })
] });
app.use("*", securityHeaders);
app.use("*", async (c, next) => {
  c.set("origin", siteOrigin(c));
  await next();
});
app.get("*", async (c, next) => {
  const { pathname, search } = new URL(c.req.url);
  if (pathname.endsWith(".html")) {
    const clean = pathname.replace(/\.html$/, "").replace(/^\/index$/, "/") || "/";
    return c.redirect(clean + search, 301);
  }
  await next();
});
app.all(
  "/api/send-email",
  async (c, next) => {
    if (c.req.method !== "POST") return c.json({ error: "M\xE9thode non autoris\xE9e." }, 405);
    await next();
  },
  rateLimit(8, 6e4),
  requireSameOrigin,
  sendEmailHandler
);
app.route("/", seo);
for (const page of pages) {
  app.get(page.path, (c) => c.html(renderPage({ ...page, origin: c.get("origin"), path: page.path })));
}
app.notFound((c) => {
  if (/\.[a-z0-9]+$/i.test(c.req.path)) return c.text("Not found", 404);
  return c.html(
    renderPage({ ...notFoundMeta, origin: c.get("origin"), path: c.req.path, noindex: true, canonical: false, Component: NotFound }),
    404
  );
});
var app_default = app;

// src/vercel-handler.ts
async function handler(req, res) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = forwardedHost || req.headers.host || "localhost";
  const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || "https";
  const hostValue = Array.isArray(host) ? host[0] : host;
  const requestUrl = new URL(req.url || "/", `${protocol}://${hostValue}`);
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value !== void 0) headers.set(name, Array.isArray(value) ? value.join(", ") : value);
  }
  const method = (req.method || "GET").toUpperCase();
  const init = {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? void 0 : req
  };
  init.duplex = "half";
  const response = await app_default.fetch(new Request(requestUrl, init));
  res.statusCode = response.status;
  response.headers.forEach((value, name) => res.setHeader(name, value));
  res.end(new Uint8Array(await response.arrayBuffer()));
}
export {
  handler as default
};
