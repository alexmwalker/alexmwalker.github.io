
"use strict";

if (
  navigator.userAgent.match(/Chrom(e|ium)/) === null ||
  parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]) < 50
) {
  console.warn("Boxy SVG is not compatible with this browser. \nUser agent string: " + navigator.userAgent);
}
else {
  window.BX_BASE_URL = "http://boxy-svg.com/api";

  // @info
  //   Traceur runtime. © 2012 Traceur Authors.
  //
  // @license
  //   Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
  //   except in compliance with the License. You may obtain a copy of the License at
  //   http://www.apache.org/licenses/LICENSE-2.0
  //
  //   Unless required by applicable law or agreed to in writing, software distributed under the
  //   License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
  //   either express or implied. See the License for the specific language governing permissions
  //   and limitations under the License.

  (function(global) {
    'use strict';
    if (global.$traceurRuntime) {
      return;
    }
    function setupGlobals(global) {
      global.Reflect = global.Reflect || {};
      global.Reflect.global = global.Reflect.global || global;
    }
    setupGlobals(global);
    var typeOf = function(x) {
      return typeof x;
    };
    global.$traceurRuntime = {
      options: {},
      setupGlobals: setupGlobals,
      typeof: typeOf
    };
  })(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
  (function() {
    function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
      var out = [];
      if (opt_scheme) {
        out.push(opt_scheme, ':');
      }
      if (opt_domain) {
        out.push('//');
        if (opt_userInfo) {
          out.push(opt_userInfo, '@');
        }
        out.push(opt_domain);
        if (opt_port) {
          out.push(':', opt_port);
        }
      }
      if (opt_path) {
        out.push(opt_path);
      }
      if (opt_queryData) {
        out.push('?', opt_queryData);
      }
      if (opt_fragment) {
        out.push('#', opt_fragment);
      }
      return out.join('');
    }
    var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
    var ComponentIndex = {
      SCHEME: 1,
      USER_INFO: 2,
      DOMAIN: 3,
      PORT: 4,
      PATH: 5,
      QUERY_DATA: 6,
      FRAGMENT: 7
    };
    function split(uri) {
      return (uri.match(splitRe));
    }
    function removeDotSegments(path) {
      if (path === '/')
        return '/';
      var leadingSlash = path[0] === '/' ? '/' : '';
      var trailingSlash = path.slice(-1) === '/' ? '/' : '';
      var segments = path.split('/');
      var out = [];
      var up = 0;
      for (var pos = 0; pos < segments.length; pos++) {
        var segment = segments[pos];
        switch (segment) {
          case '':
          case '.':
            break;
          case '..':
            if (out.length)
              out.pop();
            else
              up++;
            break;
          default:
            out.push(segment);
        }
      }
      if (!leadingSlash) {
        while (up-- > 0) {
          out.unshift('..');
        }
        if (out.length === 0)
          out.push('.');
      }
      return leadingSlash + out.join('/') + trailingSlash;
    }
    function joinAndCanonicalizePath(parts) {
      var path = parts[ComponentIndex.PATH] || '';
      path = removeDotSegments(path);
      parts[ComponentIndex.PATH] = path;
      return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
    }
    function canonicalizeUrl(url) {
      var parts = split(url);
      return joinAndCanonicalizePath(parts);
    }
    function resolveUrl(base, url) {
      var parts = split(url);
      var baseParts = split(base);
      if (parts[ComponentIndex.SCHEME]) {
        return joinAndCanonicalizePath(parts);
      } else {
        parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
      }
      for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
        if (!parts[i]) {
          parts[i] = baseParts[i];
        }
      }
      if (parts[ComponentIndex.PATH][0] == '/') {
        return joinAndCanonicalizePath(parts);
      }
      var path = baseParts[ComponentIndex.PATH];
      var index = path.lastIndexOf('/');
      path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
      parts[ComponentIndex.PATH] = path;
      return joinAndCanonicalizePath(parts);
    }
    function isAbsolute(name) {
      if (!name)
        return false;
      if (name[0] === '/')
        return true;
      var parts = split(name);
      if (parts[ComponentIndex.SCHEME])
        return true;
      return false;
    }
    $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
    $traceurRuntime.isAbsolute = isAbsolute;
    $traceurRuntime.removeDotSegments = removeDotSegments;
    $traceurRuntime.resolveUrl = resolveUrl;
  })();
  (function(global) {
    'use strict';
    var $__3 = $traceurRuntime,
        canonicalizeUrl = $__3.canonicalizeUrl,
        resolveUrl = $__3.resolveUrl,
        isAbsolute = $__3.isAbsolute;
    var moduleInstantiators = Object.create(null);
    var baseURL;
    if (global.location && global.location.href)
      baseURL = resolveUrl(global.location.href, './');
    else
      baseURL = '';
    function UncoatedModuleEntry(url, uncoatedModule) {
      this.url = url;
      this.value_ = uncoatedModule;
    }
    function ModuleEvaluationError(erroneousModuleName, cause) {
      this.message = this.constructor.name + ': ' + this.stripCause(cause) + ' in ' + erroneousModuleName;
      if (!(cause instanceof ModuleEvaluationError) && cause.stack)
        this.stack = this.stripStack(cause.stack);
      else
        this.stack = '';
    }
    ModuleEvaluationError.prototype = Object.create(Error.prototype);
    ModuleEvaluationError.prototype.constructor = ModuleEvaluationError;
    ModuleEvaluationError.prototype.stripError = function(message) {
      return message.replace(/.*Error:/, this.constructor.name + ':');
    };
    ModuleEvaluationError.prototype.stripCause = function(cause) {
      if (!cause)
        return '';
      if (!cause.message)
        return cause + '';
      return this.stripError(cause.message);
    };
    ModuleEvaluationError.prototype.loadedBy = function(moduleName) {
      this.stack += '\n loaded by ' + moduleName;
    };
    ModuleEvaluationError.prototype.stripStack = function(causeStack) {
      var stack = [];
      causeStack.split('\n').some(function(frame) {
        if (/UncoatedModuleInstantiator/.test(frame))
          return true;
        stack.push(frame);
      });
      stack[0] = this.stripError(stack[0]);
      return stack.join('\n');
    };
    function beforeLines(lines, number) {
      var result = [];
      var first = number - 3;
      if (first < 0)
        first = 0;
      for (var i = first; i < number; i++) {
        result.push(lines[i]);
      }
      return result;
    }
    function afterLines(lines, number) {
      var last = number + 1;
      if (last > lines.length - 1)
        last = lines.length - 1;
      var result = [];
      for (var i = number; i <= last; i++) {
        result.push(lines[i]);
      }
      return result;
    }
    function columnSpacing(columns) {
      var result = '';
      for (var i = 0; i < columns - 1; i++) {
        result += '-';
      }
      return result;
    }
    function UncoatedModuleInstantiator(url, func) {
      UncoatedModuleEntry.call(this, url, null);
      this.func = func;
    }
    UncoatedModuleInstantiator.prototype = Object.create(UncoatedModuleEntry.prototype);
    UncoatedModuleInstantiator.prototype.getUncoatedModule = function() {
      var $__2 = this;
      if (this.value_)
        return this.value_;
      try {
        var relativeRequire;
        if (typeof $traceurRuntime !== undefined && $traceurRuntime.require) {
          relativeRequire = $traceurRuntime.require.bind(null, this.url);
        }
        return this.value_ = this.func.call(global, relativeRequire);
      } catch (ex) {
        if (ex instanceof ModuleEvaluationError) {
          ex.loadedBy(this.url);
          throw ex;
        }
        if (ex.stack) {
          var lines = this.func.toString().split('\n');
          var evaled = [];
          ex.stack.split('\n').some(function(frame, index) {
            if (frame.indexOf('UncoatedModuleInstantiator.getUncoatedModule') > 0)
              return true;
            var m = /(at\s[^\s]*\s).*>:(\d*):(\d*)\)/.exec(frame);
            if (m) {
              var line = parseInt(m[2], 10);
              evaled = evaled.concat(beforeLines(lines, line));
              if (index === 1) {
                evaled.push(columnSpacing(m[3]) + '^ ' + $__2.url);
              } else {
                evaled.push(columnSpacing(m[3]) + '^');
              }
              evaled = evaled.concat(afterLines(lines, line));
              evaled.push('= = = = = = = = =');
            } else {
              evaled.push(frame);
            }
          });
          ex.stack = evaled.join('\n');
        }
        throw new ModuleEvaluationError(this.url, ex);
      }
    };
    function getUncoatedModuleInstantiator(name) {
      if (!name)
        return;
      var url = ModuleStore.normalize(name);
      return moduleInstantiators[url];
    }
    ;
    var moduleInstances = Object.create(null);
    var liveModuleSentinel = {};
    function Module(uncoatedModule) {
      var isLive = arguments[1];
      var coatedModule = Object.create(null);
      Object.getOwnPropertyNames(uncoatedModule).forEach(function(name) {
        var getter,
            value;
        if (isLive === liveModuleSentinel) {
          var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
          if (descr.get)
            getter = descr.get;
        }
        if (!getter) {
          value = uncoatedModule[name];
          getter = function() {
            return value;
          };
        }
        Object.defineProperty(coatedModule, name, {
          get: getter,
          enumerable: true
        });
      });
      Object.preventExtensions(coatedModule);
      return coatedModule;
    }
    var ModuleStore = {
      normalize: function(name, refererName, refererAddress) {
        if (typeof name !== 'string')
          throw new TypeError('module name must be a string, not ' + typeof name);
        if (isAbsolute(name))
          return canonicalizeUrl(name);
        if (/[^\.]\/\.\.\//.test(name)) {
          throw new Error('module name embeds /../: ' + name);
        }
        if (name[0] === '.' && refererName)
          return resolveUrl(refererName, name);
        return canonicalizeUrl(name);
      },
      get: function(normalizedName) {
        var m = getUncoatedModuleInstantiator(normalizedName);
        if (!m)
          return undefined;
        var moduleInstance = moduleInstances[m.url];
        if (moduleInstance)
          return moduleInstance;
        moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
        return moduleInstances[m.url] = moduleInstance;
      },
      set: function(normalizedName, module) {
        normalizedName = String(normalizedName);
        moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, function() {
          return module;
        });
        moduleInstances[normalizedName] = module;
      },
      get baseURL() {
        return baseURL;
      },
      set baseURL(v) {
        baseURL = String(v);
      },
      registerModule: function(name, deps, func) {
        var normalizedName = ModuleStore.normalize(name);
        if (moduleInstantiators[normalizedName])
          throw new Error('duplicate module named ' + normalizedName);
        moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
      },
      bundleStore: Object.create(null),
      register: function(name, deps, func) {
        if (!deps || !deps.length && !func.length) {
          this.registerModule(name, deps, func);
        } else {
          this.bundleStore[name] = {
            deps: deps,
            execute: function() {
              var $__2 = arguments;
              var depMap = {};
              deps.forEach(function(dep, index) {
                return depMap[dep] = $__2[index];
              });
              var registryEntry = func.call(this, depMap);
              registryEntry.execute.call(this);
              return registryEntry.exports;
            }
          };
        }
      },
      getAnonymousModule: function(func) {
        return new Module(func.call(global), liveModuleSentinel);
      }
    };
    var moduleStoreModule = new Module({ModuleStore: ModuleStore});
    ModuleStore.set('@traceur/src/runtime/ModuleStore.js', moduleStoreModule);
    var setupGlobals = $traceurRuntime.setupGlobals;
    $traceurRuntime.setupGlobals = function(global) {
      setupGlobals(global);
    };
    $traceurRuntime.ModuleStore = ModuleStore;
    $traceurRuntime.registerModule = ModuleStore.registerModule.bind(ModuleStore);
    $traceurRuntime.getModule = ModuleStore.get;
    $traceurRuntime.setModule = ModuleStore.set;
    $traceurRuntime.normalizeModuleName = ModuleStore.normalize;
  })(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/new-unique-string.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/new-unique-string.js";
    var random = Math.random;
    var counter = Date.now() % 1e9;
    function newUniqueString() {
      return '__$' + (random() * 1e9 >>> 1) + '$' + ++counter + '$__';
    }
    var $__default = newUniqueString;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/has-native-symbols.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/has-native-symbols.js";
    var v = !!Object.getOwnPropertySymbols && typeof Symbol === 'function';
    function hasNativeSymbol() {
      return v;
    }
    var $__default = hasNativeSymbol;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/symbols.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/symbols.js";
    var newUniqueString = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../new-unique-string.js", "traceur-runtime@0.0.108/src/runtime/modules/symbols.js")).default;
    var hasNativeSymbol = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../has-native-symbols.js", "traceur-runtime@0.0.108/src/runtime/modules/symbols.js")).default;
    var $create = Object.create;
    var $defineProperty = Object.defineProperty;
    var $freeze = Object.freeze;
    var $getOwnPropertyNames = Object.getOwnPropertyNames;
    var $keys = Object.keys;
    var $TypeError = TypeError;
    function nonEnum(value) {
      return {
        configurable: true,
        enumerable: false,
        value: value,
        writable: true
      };
    }
    var symbolInternalProperty = newUniqueString();
    var symbolDescriptionProperty = newUniqueString();
    var symbolDataProperty = newUniqueString();
    var symbolValues = $create(null);
    var SymbolImpl = function Symbol(description) {
      var value = new SymbolValue(description);
      if (!(this instanceof SymbolImpl))
        return value;
      throw new $TypeError('Symbol cannot be new\'ed');
    };
    $defineProperty(SymbolImpl.prototype, 'constructor', nonEnum(SymbolImpl));
    $defineProperty(SymbolImpl.prototype, 'toString', nonEnum(function() {
      var symbolValue = this[symbolDataProperty];
      return symbolValue[symbolInternalProperty];
    }));
    $defineProperty(SymbolImpl.prototype, 'valueOf', nonEnum(function() {
      var symbolValue = this[symbolDataProperty];
      if (!symbolValue)
        throw $TypeError('Conversion from symbol to string');
      return symbolValue[symbolInternalProperty];
    }));
    function SymbolValue(description) {
      var key = newUniqueString();
      $defineProperty(this, symbolDataProperty, {value: this});
      $defineProperty(this, symbolInternalProperty, {value: key});
      $defineProperty(this, symbolDescriptionProperty, {value: description});
      $freeze(this);
      symbolValues[key] = this;
    }
    $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(SymbolImpl));
    $defineProperty(SymbolValue.prototype, 'toString', {
      value: SymbolImpl.prototype.toString,
      enumerable: false
    });
    $defineProperty(SymbolValue.prototype, 'valueOf', {
      value: SymbolImpl.prototype.valueOf,
      enumerable: false
    });
    $freeze(SymbolValue.prototype);
    function isSymbolString(s) {
      return symbolValues[s];
    }
    function removeSymbolKeys(array) {
      var rv = [];
      for (var i = 0; i < array.length; i++) {
        if (!isSymbolString(array[i])) {
          rv.push(array[i]);
        }
      }
      return rv;
    }
    function getOwnPropertyNames(object) {
      return removeSymbolKeys($getOwnPropertyNames(object));
    }
    function keys(object) {
      return removeSymbolKeys($keys(object));
    }
    function getOwnPropertySymbols(object) {
      var rv = [];
      var names = $getOwnPropertyNames(object);
      for (var i = 0; i < names.length; i++) {
        var symbol = symbolValues[names[i]];
        if (symbol) {
          rv.push(symbol);
        }
      }
      return rv;
    }
    function polyfillSymbol(global) {
      var Object = global.Object;
      if (!hasNativeSymbol()) {
        global.Symbol = SymbolImpl;
        Object.getOwnPropertyNames = getOwnPropertyNames;
        Object.keys = keys;
        $defineProperty(Object, 'getOwnPropertySymbols', nonEnum(getOwnPropertySymbols));
      }
      if (!global.Symbol.iterator) {
        global.Symbol.iterator = global.Symbol('Symbol.iterator');
      }
      if (!global.Symbol.observer) {
        global.Symbol.observer = global.Symbol('Symbol.observer');
      }
    }
    var g = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this;
    polyfillSymbol(g);
    var typeOf = hasNativeSymbol() ? function(x) {
      return typeof x;
    } : function(x) {
      return x instanceof SymbolValue ? 'symbol' : typeof x;
    };
    return {get typeof() {
        return typeOf;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/typeof.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/typeof.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_symbols_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./symbols.js", "traceur-runtime@0.0.108/src/runtime/modules/typeof.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_symbols_46_js__.typeof;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/symbols.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/symbols.js";
    var t = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/typeof.js", "traceur-runtime@0.0.108/src/runtime/symbols.js")).default;
    $traceurRuntime.typeof = t;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/createClass.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/createClass.js";
    var $Object = Object;
    var $TypeError = TypeError;
    var $__1 = Object,
        create = $__1.create,
        defineProperties = $__1.defineProperties,
        defineProperty = $__1.defineProperty,
        getOwnPropertyDescriptor = $__1.getOwnPropertyDescriptor,
        getOwnPropertyNames = $__1.getOwnPropertyNames,
        getOwnPropertySymbols = $__1.getOwnPropertySymbols;
    function forEachPropertyKey(object, f) {
      getOwnPropertyNames(object).forEach(f);
      if (getOwnPropertySymbols) {
        getOwnPropertySymbols(object).forEach(f);
      }
    }
    function getDescriptors(object) {
      var descriptors = {};
      forEachPropertyKey(object, function(key) {
        descriptors[key] = getOwnPropertyDescriptor(object, key);
        descriptors[key].enumerable = false;
      });
      return descriptors;
    }
    var nonEnum = {enumerable: false};
    function makePropertiesNonEnumerable(object) {
      forEachPropertyKey(object, function(key) {
        defineProperty(object, key, nonEnum);
      });
    }
    function createClass(ctor, object, staticObject, superClass) {
      defineProperty(object, 'constructor', {
        value: ctor,
        configurable: true,
        enumerable: false,
        writable: true
      });
      if (arguments.length > 3) {
        if (typeof superClass === 'function')
          ctor.__proto__ = superClass;
        ctor.prototype = create(getProtoParent(superClass), getDescriptors(object));
      } else {
        makePropertiesNonEnumerable(object);
        ctor.prototype = object;
      }
      defineProperty(ctor, 'prototype', {
        configurable: false,
        writable: false
      });
      return defineProperties(ctor, getDescriptors(staticObject));
    }
    var $__default = createClass;
    function getProtoParent(superClass) {
      if (typeof superClass === 'function') {
        var prototype = superClass.prototype;
        if ($Object(prototype) === prototype || prototype === null)
          return superClass.prototype;
        throw new $TypeError('super prototype must be an Object or null');
      }
      if (superClass === null)
        return null;
      throw new $TypeError(("Super expression must either be null or a function, not " + typeof superClass + "."));
    }
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/superConstructor.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/superConstructor.js";
    function superConstructor(ctor) {
      return ctor.__proto__;
    }
    var $__default = superConstructor;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/superDescriptor.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/superDescriptor.js";
    var $__0 = Object,
        getOwnPropertyDescriptor = $__0.getOwnPropertyDescriptor,
        getPrototypeOf = $__0.getPrototypeOf;
    function superDescriptor(homeObject, name) {
      var proto = getPrototypeOf(homeObject);
      do {
        var result = getOwnPropertyDescriptor(proto, name);
        if (result)
          return result;
        proto = getPrototypeOf(proto);
      } while (proto);
      return undefined;
    }
    var $__default = superDescriptor;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/superGet.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/superGet.js";
    var superDescriptor = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./superDescriptor.js", "traceur-runtime@0.0.108/src/runtime/modules/superGet.js")).default;
    function superGet(self, homeObject, name) {
      var descriptor = superDescriptor(homeObject, name);
      if (descriptor) {
        var value = descriptor.value;
        if (value)
          return value;
        if (!descriptor.get)
          return value;
        return descriptor.get.call(self);
      }
      return undefined;
    }
    var $__default = superGet;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/superSet.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/superSet.js";
    var superDescriptor = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./superDescriptor.js", "traceur-runtime@0.0.108/src/runtime/modules/superSet.js")).default;
    var $TypeError = TypeError;
    function superSet(self, homeObject, name, value) {
      var descriptor = superDescriptor(homeObject, name);
      if (descriptor && descriptor.set) {
        descriptor.set.call(self, value);
        return value;
      }
      throw $TypeError(("super has no setter '" + name + "'."));
    }
    var $__default = superSet;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/classes.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/classes.js";
    var createClass = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/createClass.js", "traceur-runtime@0.0.108/src/runtime/classes.js")).default;
    var superConstructor = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/superConstructor.js", "traceur-runtime@0.0.108/src/runtime/classes.js")).default;
    var superGet = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/superGet.js", "traceur-runtime@0.0.108/src/runtime/classes.js")).default;
    var superSet = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/superSet.js", "traceur-runtime@0.0.108/src/runtime/classes.js")).default;
    $traceurRuntime.createClass = createClass;
    $traceurRuntime.superConstructor = superConstructor;
    $traceurRuntime.superGet = superGet;
    $traceurRuntime.superSet = superSet;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/exportStar.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/exportStar.js";
    var $__1 = Object,
        defineProperty = $__1.defineProperty,
        getOwnPropertyNames = $__1.getOwnPropertyNames;
    function exportStar(object) {
      var $__2 = arguments,
          $__3 = function(i) {
            var mod = $__2[i];
            var names = getOwnPropertyNames(mod);
            var $__5 = function(j) {
              var name = names[j];
              if (name === '__esModule' || name === 'default') {
                return 0;
              }
              defineProperty(object, name, {
                get: function() {
                  return mod[name];
                },
                enumerable: true
              });
            },
                $__6;
            $__4: for (var j = 0; j < names.length; j++) {
              $__6 = $__5(j);
              switch ($__6) {
                case 0:
                  continue $__4;
              }
            }
          };
      for (var i = 1; i < arguments.length; i++) {
        $__3(i);
      }
      return object;
    }
    var $__default = exportStar;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/exportStar.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/exportStar.js";
    var exportStar = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/exportStar.js", "traceur-runtime@0.0.108/src/runtime/exportStar.js")).default;
    $traceurRuntime.exportStar = exportStar;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/private-symbol.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/private-symbol.js";
    var newUniqueString = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./new-unique-string.js", "traceur-runtime@0.0.108/src/runtime/private-symbol.js")).default;
    var $Symbol = typeof Symbol === 'function' ? Symbol : undefined;
    var $getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var $create = Object.create;
    var privateNames = $create(null);
    function isPrivateSymbol(s) {
      return privateNames[s];
    }
    ;
    function createPrivateSymbol() {
      var s = ($Symbol || newUniqueString)();
      privateNames[s] = true;
      return s;
    }
    ;
    function hasPrivate(obj, sym) {
      return hasOwnProperty.call(obj, sym);
    }
    ;
    function deletePrivate(obj, sym) {
      if (!hasPrivate(obj, sym)) {
        return false;
      }
      delete obj[sym];
      return true;
    }
    ;
    function setPrivate(obj, sym, val) {
      obj[sym] = val;
    }
    ;
    function getPrivate(obj, sym) {
      var val = obj[sym];
      if (val === undefined)
        return undefined;
      return hasOwnProperty.call(obj, sym) ? val : undefined;
    }
    ;
    function init() {
      if ($getOwnPropertySymbols) {
        Object.getOwnPropertySymbols = function getOwnPropertySymbols(object) {
          var rv = [];
          var symbols = $getOwnPropertySymbols(object);
          for (var i = 0; i < symbols.length; i++) {
            var symbol = symbols[i];
            if (!isPrivateSymbol(symbol)) {
              rv.push(symbol);
            }
          }
          return rv;
        };
      }
    }
    return {
      get isPrivateSymbol() {
        return isPrivateSymbol;
      },
      get createPrivateSymbol() {
        return createPrivateSymbol;
      },
      get hasPrivate() {
        return hasPrivate;
      },
      get deletePrivate() {
        return deletePrivate;
      },
      get setPrivate() {
        return setPrivate;
      },
      get getPrivate() {
        return getPrivate;
      },
      get init() {
        return init;
      }
    };
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/private-weak-map.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/private-weak-map.js";
    var $WeakMap = typeof WeakMap === 'function' ? WeakMap : undefined;
    function isPrivateSymbol(s) {
      return false;
    }
    function createPrivateSymbol() {
      return new $WeakMap();
    }
    function hasPrivate(obj, sym) {
      return sym.has(obj);
    }
    function deletePrivate(obj, sym) {
      return sym.delete(obj);
    }
    function setPrivate(obj, sym, val) {
      sym.set(obj, val);
    }
    function getPrivate(obj, sym) {
      return sym.get(obj);
    }
    function init() {}
    return {
      get isPrivateSymbol() {
        return isPrivateSymbol;
      },
      get createPrivateSymbol() {
        return createPrivateSymbol;
      },
      get hasPrivate() {
        return hasPrivate;
      },
      get deletePrivate() {
        return deletePrivate;
      },
      get setPrivate() {
        return setPrivate;
      },
      get getPrivate() {
        return getPrivate;
      },
      get init() {
        return init;
      }
    };
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/private.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/private.js";
    var sym = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./private-symbol.js", "traceur-runtime@0.0.108/src/runtime/private.js"));
    var weak = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./private-weak-map.js", "traceur-runtime@0.0.108/src/runtime/private.js"));
    var hasWeakMap = typeof WeakMap === 'function';
    var m = hasWeakMap ? weak : sym;
    var isPrivateSymbol = m.isPrivateSymbol;
    var createPrivateSymbol = m.createPrivateSymbol;
    var hasPrivate = m.hasPrivate;
    var deletePrivate = m.deletePrivate;
    var setPrivate = m.setPrivate;
    var getPrivate = m.getPrivate;
    m.init();
    return {
      get isPrivateSymbol() {
        return isPrivateSymbol;
      },
      get createPrivateSymbol() {
        return createPrivateSymbol;
      },
      get hasPrivate() {
        return hasPrivate;
      },
      get deletePrivate() {
        return deletePrivate;
      },
      get setPrivate() {
        return setPrivate;
      },
      get getPrivate() {
        return getPrivate;
      }
    };
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/properTailCalls.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/properTailCalls.js";
    var $__0 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../private.js", "traceur-runtime@0.0.108/src/runtime/modules/properTailCalls.js")),
        getPrivate = $__0.getPrivate,
        setPrivate = $__0.setPrivate,
        createPrivateSymbol = $__0.createPrivateSymbol;
    var $apply = Function.prototype.call.bind(Function.prototype.apply);
    var CONTINUATION_TYPE = Object.create(null);
    var isTailRecursiveName = null;
    function createContinuation(operand, thisArg, argsArray) {
      return [CONTINUATION_TYPE, operand, thisArg, argsArray];
    }
    function isContinuation(object) {
      return object && object[0] === CONTINUATION_TYPE;
    }
    function $bind(operand, thisArg, args) {
      var argArray = [thisArg];
      for (var i = 0; i < args.length; i++) {
        argArray[i + 1] = args[i];
      }
      var func = $apply(Function.prototype.bind, operand, argArray);
      return func;
    }
    function $construct(func, argArray) {
      var object = new ($bind(func, null, argArray));
      return object;
    }
    function isTailRecursive(func) {
      return !!getPrivate(func, isTailRecursiveName);
    }
    function tailCall(func, thisArg, argArray) {
      var continuation = argArray[0];
      if (isContinuation(continuation)) {
        continuation = $apply(func, thisArg, continuation[3]);
        return continuation;
      }
      continuation = createContinuation(func, thisArg, argArray);
      while (true) {
        if (isTailRecursive(func)) {
          continuation = $apply(func, continuation[2], [continuation]);
        } else {
          continuation = $apply(func, continuation[2], continuation[3]);
        }
        if (!isContinuation(continuation)) {
          return continuation;
        }
        func = continuation[1];
      }
    }
    function construct() {
      var object;
      if (isTailRecursive(this)) {
        object = $construct(this, [createContinuation(null, null, arguments)]);
      } else {
        object = $construct(this, arguments);
      }
      return object;
    }
    function setupProperTailCalls() {
      isTailRecursiveName = createPrivateSymbol();
      Function.prototype.call = initTailRecursiveFunction(function call(thisArg) {
        var result = tailCall(function(thisArg) {
          var argArray = [];
          for (var i = 1; i < arguments.length; ++i) {
            argArray[i - 1] = arguments[i];
          }
          var continuation = createContinuation(this, thisArg, argArray);
          return continuation;
        }, this, arguments);
        return result;
      });
      Function.prototype.apply = initTailRecursiveFunction(function apply(thisArg, argArray) {
        var result = tailCall(function(thisArg, argArray) {
          var continuation = createContinuation(this, thisArg, argArray);
          return continuation;
        }, this, arguments);
        return result;
      });
    }
    function initTailRecursiveFunction(func) {
      if (isTailRecursiveName === null) {
        setupProperTailCalls();
      }
      setPrivate(func, isTailRecursiveName, true);
      return func;
    }
    return {
      get createContinuation() {
        return createContinuation;
      },
      get tailCall() {
        return tailCall;
      },
      get construct() {
        return construct;
      },
      get initTailRecursiveFunction() {
        return initTailRecursiveFunction;
      }
    };
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/initTailRecursiveFunction.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/initTailRecursiveFunction.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_properTailCalls_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./properTailCalls.js", "traceur-runtime@0.0.108/src/runtime/modules/initTailRecursiveFunction.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_properTailCalls_46_js__.initTailRecursiveFunction;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/call.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/call.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_properTailCalls_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./properTailCalls.js", "traceur-runtime@0.0.108/src/runtime/modules/call.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_properTailCalls_46_js__.tailCall;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/continuation.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/continuation.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_properTailCalls_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./properTailCalls.js", "traceur-runtime@0.0.108/src/runtime/modules/continuation.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_properTailCalls_46_js__.createContinuation;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/construct.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/construct.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_properTailCalls_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./properTailCalls.js", "traceur-runtime@0.0.108/src/runtime/modules/construct.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_properTailCalls_46_js__.construct;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/properTailCalls.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/properTailCalls.js";
    var initTailRecursiveFunction = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/initTailRecursiveFunction.js", "traceur-runtime@0.0.108/src/runtime/properTailCalls.js")).default;
    var call = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/call.js", "traceur-runtime@0.0.108/src/runtime/properTailCalls.js")).default;
    var continuation = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/continuation.js", "traceur-runtime@0.0.108/src/runtime/properTailCalls.js")).default;
    var construct = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/construct.js", "traceur-runtime@0.0.108/src/runtime/properTailCalls.js")).default;
    $traceurRuntime.initTailRecursiveFunction = initTailRecursiveFunction;
    $traceurRuntime.call = call;
    $traceurRuntime.continuation = continuation;
    $traceurRuntime.construct = construct;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/relativeRequire.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/relativeRequire.js";
    var path;
    function relativeRequire(callerPath, requiredPath) {
      path = path || typeof require !== 'undefined' && require('path');
      function isDirectory(path) {
        return path.slice(-1) === '/';
      }
      function isAbsolute(path) {
        return path[0] === '/';
      }
      function isRelative(path) {
        return path[0] === '.';
      }
      if (isDirectory(requiredPath) || isAbsolute(requiredPath))
        return;
      return isRelative(requiredPath) ? require(path.resolve(path.dirname(callerPath), requiredPath)) : require(requiredPath);
    }
    $traceurRuntime.require = relativeRequire;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/checkObjectCoercible.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/checkObjectCoercible.js";
    var $TypeError = TypeError;
    function checkObjectCoercible(v) {
      if (v === null || v === undefined) {
        throw new $TypeError('Value cannot be converted to an Object');
      }
      return v;
    }
    var $__default = checkObjectCoercible;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/spread.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/spread.js";
    var checkObjectCoercible = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../checkObjectCoercible.js", "traceur-runtime@0.0.108/src/runtime/modules/spread.js")).default;
    function spread() {
      var rv = [],
          j = 0,
          iterResult;
      for (var i = 0; i < arguments.length; i++) {
        var valueToSpread = checkObjectCoercible(arguments[i]);
        if (typeof valueToSpread[Symbol.iterator] !== 'function') {
          throw new TypeError('Cannot spread non-iterable object.');
        }
        var iter = valueToSpread[Symbol.iterator]();
        while (!(iterResult = iter.next()).done) {
          rv[j++] = iterResult.value;
        }
      }
      return rv;
    }
    var $__default = spread;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/spread.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/spread.js";
    var spread = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/spread.js", "traceur-runtime@0.0.108/src/runtime/spread.js")).default;
    $traceurRuntime.spread = spread;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/iteratorToArray.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/iteratorToArray.js";
    function iteratorToArray(iter) {
      var rv = [];
      var i = 0;
      var tmp;
      while (!(tmp = iter.next()).done) {
        rv[i++] = tmp.value;
      }
      return rv;
    }
    var $__default = iteratorToArray;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/destructuring.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/destructuring.js";
    var iteratorToArray = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/iteratorToArray.js", "traceur-runtime@0.0.108/src/runtime/destructuring.js")).default;
    $traceurRuntime.iteratorToArray = iteratorToArray;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/async.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/async.js";
    var $__12 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../private.js", "traceur-runtime@0.0.108/src/runtime/modules/async.js")),
        createPrivateSymbol = $__12.createPrivateSymbol,
        getPrivate = $__12.getPrivate,
        setPrivate = $__12.setPrivate;
    var $__11 = Object,
        create = $__11.create,
        defineProperty = $__11.defineProperty;
    var observeName = createPrivateSymbol();
    function AsyncGeneratorFunction() {}
    function AsyncGeneratorFunctionPrototype() {}
    AsyncGeneratorFunction.prototype = AsyncGeneratorFunctionPrototype;
    AsyncGeneratorFunctionPrototype.constructor = AsyncGeneratorFunction;
    defineProperty(AsyncGeneratorFunctionPrototype, 'constructor', {enumerable: false});
    var AsyncGeneratorContext = function() {
      function AsyncGeneratorContext(observer) {
        var $__2 = this;
        this.decoratedObserver = createDecoratedGenerator(observer, function() {
          $__2.done = true;
        });
        this.done = false;
        this.inReturn = false;
      }
      return ($traceurRuntime.createClass)(AsyncGeneratorContext, {
        throw: function(error) {
          if (!this.inReturn) {
            throw error;
          }
        },
        yield: function(value) {
          if (this.done) {
            this.inReturn = true;
            throw undefined;
          }
          var result;
          try {
            result = this.decoratedObserver.next(value);
          } catch (e) {
            this.done = true;
            throw e;
          }
          if (result === undefined) {
            return;
          }
          if (result.done) {
            this.done = true;
            this.inReturn = true;
            throw undefined;
          }
          return result.value;
        },
        yieldFor: function(observable) {
          var ctx = this;
          return observeForEach(observable[Symbol.observer].bind(observable), function(value) {
            if (ctx.done) {
              this.return();
              return;
            }
            var result;
            try {
              result = ctx.decoratedObserver.next(value);
            } catch (e) {
              ctx.done = true;
              throw e;
            }
            if (result === undefined) {
              return;
            }
            if (result.done) {
              ctx.done = true;
            }
            return result;
          });
        }
      }, {});
    }();
    AsyncGeneratorFunctionPrototype.prototype[Symbol.observer] = function(observer) {
      var observe = getPrivate(this, observeName);
      var ctx = new AsyncGeneratorContext(observer);
      schedule(function() {
        return observe(ctx);
      }).then(function(value) {
        if (!ctx.done) {
          ctx.decoratedObserver.return(value);
        }
      }).catch(function(error) {
        if (!ctx.done) {
          ctx.decoratedObserver.throw(error);
        }
      });
      return ctx.decoratedObserver;
    };
    defineProperty(AsyncGeneratorFunctionPrototype.prototype, Symbol.observer, {enumerable: false});
    function initAsyncGeneratorFunction(functionObject) {
      functionObject.prototype = create(AsyncGeneratorFunctionPrototype.prototype);
      functionObject.__proto__ = AsyncGeneratorFunctionPrototype;
      return functionObject;
    }
    function createAsyncGeneratorInstance(observe, functionObject) {
      for (var args = [],
          $__10 = 2; $__10 < arguments.length; $__10++)
        args[$__10 - 2] = arguments[$__10];
      var object = create(functionObject.prototype);
      setPrivate(object, observeName, observe);
      return object;
    }
    function observeForEach(observe, next) {
      return new Promise(function(resolve, reject) {
        var generator = observe({
          next: function(value) {
            return next.call(generator, value);
          },
          throw: function(error) {
            reject(error);
          },
          return: function(value) {
            resolve(value);
          }
        });
      });
    }
    function schedule(asyncF) {
      return Promise.resolve().then(asyncF);
    }
    var generator = Symbol();
    var onDone = Symbol();
    var DecoratedGenerator = function() {
      function DecoratedGenerator(_generator, _onDone) {
        this[generator] = _generator;
        this[onDone] = _onDone;
      }
      return ($traceurRuntime.createClass)(DecoratedGenerator, {
        next: function(value) {
          var result = this[generator].next(value);
          if (result !== undefined && result.done) {
            this[onDone].call(this);
          }
          return result;
        },
        throw: function(error) {
          this[onDone].call(this);
          return this[generator].throw(error);
        },
        return: function(value) {
          this[onDone].call(this);
          return this[generator].return(value);
        }
      }, {});
    }();
    function createDecoratedGenerator(generator, onDone) {
      return new DecoratedGenerator(generator, onDone);
    }
    Array.prototype[Symbol.observer] = function(observer) {
      var done = false;
      var decoratedObserver = createDecoratedGenerator(observer, function() {
        return done = true;
      });
      var $__6 = true;
      var $__7 = false;
      var $__8 = undefined;
      try {
        for (var $__4 = void 0,
            $__3 = (this)[Symbol.iterator](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
          var value = $__4.value;
          {
            decoratedObserver.next(value);
            if (done) {
              return;
            }
          }
        }
      } catch ($__9) {
        $__7 = true;
        $__8 = $__9;
      } finally {
        try {
          if (!$__6 && $__3.return != null) {
            $__3.return();
          }
        } finally {
          if ($__7) {
            throw $__8;
          }
        }
      }
      decoratedObserver.return();
      return decoratedObserver;
    };
    defineProperty(Array.prototype, Symbol.observer, {enumerable: false});
    return {
      get initAsyncGeneratorFunction() {
        return initAsyncGeneratorFunction;
      },
      get createAsyncGeneratorInstance() {
        return createAsyncGeneratorInstance;
      },
      get observeForEach() {
        return observeForEach;
      },
      get schedule() {
        return schedule;
      },
      get createDecoratedGenerator() {
        return createDecoratedGenerator;
      }
    };
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/initAsyncGeneratorFunction.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/initAsyncGeneratorFunction.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_async_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./async.js", "traceur-runtime@0.0.108/src/runtime/modules/initAsyncGeneratorFunction.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_async_46_js__.initAsyncGeneratorFunction;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/createAsyncGeneratorInstance.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/createAsyncGeneratorInstance.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_async_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./async.js", "traceur-runtime@0.0.108/src/runtime/modules/createAsyncGeneratorInstance.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_async_46_js__.createAsyncGeneratorInstance;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/observeForEach.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/observeForEach.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_async_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./async.js", "traceur-runtime@0.0.108/src/runtime/modules/observeForEach.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_async_46_js__.observeForEach;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/schedule.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/schedule.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_async_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./async.js", "traceur-runtime@0.0.108/src/runtime/modules/schedule.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_async_46_js__.schedule;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/createDecoratedGenerator.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/createDecoratedGenerator.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_async_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./async.js", "traceur-runtime@0.0.108/src/runtime/modules/createDecoratedGenerator.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_async_46_js__.createDecoratedGenerator;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/async.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/async.js";
    var initAsyncGeneratorFunction = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/initAsyncGeneratorFunction.js", "traceur-runtime@0.0.108/src/runtime/async.js")).default;
    var createAsyncGeneratorInstance = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/createAsyncGeneratorInstance.js", "traceur-runtime@0.0.108/src/runtime/async.js")).default;
    var observeForEach = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/observeForEach.js", "traceur-runtime@0.0.108/src/runtime/async.js")).default;
    var schedule = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/schedule.js", "traceur-runtime@0.0.108/src/runtime/async.js")).default;
    var createDecoratedGenerator = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/createDecoratedGenerator.js", "traceur-runtime@0.0.108/src/runtime/async.js")).default;
    $traceurRuntime.initAsyncGeneratorFunction = initAsyncGeneratorFunction;
    $traceurRuntime.createAsyncGeneratorInstance = createAsyncGeneratorInstance;
    $traceurRuntime.observeForEach = observeForEach;
    $traceurRuntime.schedule = schedule;
    $traceurRuntime.createDecoratedGenerator = createDecoratedGenerator;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/generators.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/generators.js";
    var $__2 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../private.js", "traceur-runtime@0.0.108/src/runtime/modules/generators.js")),
        createPrivateSymbol = $__2.createPrivateSymbol,
        getPrivate = $__2.getPrivate,
        setPrivate = $__2.setPrivate;
    var $TypeError = TypeError;
    var $__1 = Object,
        create = $__1.create,
        defineProperties = $__1.defineProperties,
        defineProperty = $__1.defineProperty;
    function nonEnum(value) {
      return {
        configurable: true,
        enumerable: false,
        value: value,
        writable: true
      };
    }
    var ST_NEWBORN = 0;
    var ST_EXECUTING = 1;
    var ST_SUSPENDED = 2;
    var ST_CLOSED = 3;
    var END_STATE = -2;
    var RETHROW_STATE = -3;
    function getInternalError(state) {
      return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
    }
    var RETURN_SENTINEL = {};
    function GeneratorContext() {
      this.state = 0;
      this.GState = ST_NEWBORN;
      this.storedException = undefined;
      this.finallyFallThrough = undefined;
      this.sent_ = undefined;
      this.returnValue = undefined;
      this.oldReturnValue = undefined;
      this.tryStack_ = [];
    }
    GeneratorContext.prototype = {
      pushTry: function(catchState, finallyState) {
        if (finallyState !== null) {
          var finallyFallThrough = null;
          for (var i = this.tryStack_.length - 1; i >= 0; i--) {
            if (this.tryStack_[i].catch !== undefined) {
              finallyFallThrough = this.tryStack_[i].catch;
              break;
            }
          }
          if (finallyFallThrough === null)
            finallyFallThrough = RETHROW_STATE;
          this.tryStack_.push({
            finally: finallyState,
            finallyFallThrough: finallyFallThrough
          });
        }
        if (catchState !== null) {
          this.tryStack_.push({catch: catchState});
        }
      },
      popTry: function() {
        this.tryStack_.pop();
      },
      maybeUncatchable: function() {
        if (this.storedException === RETURN_SENTINEL) {
          throw RETURN_SENTINEL;
        }
      },
      get sent() {
        this.maybeThrow();
        return this.sent_;
      },
      set sent(v) {
        this.sent_ = v;
      },
      get sentIgnoreThrow() {
        return this.sent_;
      },
      maybeThrow: function() {
        if (this.action === 'throw') {
          this.action = 'next';
          throw this.sent_;
        }
      },
      end: function() {
        switch (this.state) {
          case END_STATE:
            return this;
          case RETHROW_STATE:
            throw this.storedException;
          default:
            throw getInternalError(this.state);
        }
      },
      handleException: function(ex) {
        this.GState = ST_CLOSED;
        this.state = END_STATE;
        throw ex;
      },
      wrapYieldStar: function(iterator) {
        var ctx = this;
        return {
          next: function(v) {
            return iterator.next(v);
          },
          throw: function(e) {
            var result;
            if (e === RETURN_SENTINEL) {
              if (iterator.return) {
                result = iterator.return(ctx.returnValue);
                if (!result.done) {
                  ctx.returnValue = ctx.oldReturnValue;
                  return result;
                }
                ctx.returnValue = result.value;
              }
              throw e;
            }
            if (iterator.throw) {
              return iterator.throw(e);
            }
            iterator.return && iterator.return();
            throw $TypeError('Inner iterator does not have a throw method');
          }
        };
      }
    };
    function nextOrThrow(ctx, moveNext, action, x) {
      switch (ctx.GState) {
        case ST_EXECUTING:
          throw new Error(("\"" + action + "\" on executing generator"));
        case ST_CLOSED:
          if (action == 'next') {
            return {
              value: undefined,
              done: true
            };
          }
          if (x === RETURN_SENTINEL) {
            return {
              value: ctx.returnValue,
              done: true
            };
          }
          throw x;
        case ST_NEWBORN:
          if (action === 'throw') {
            ctx.GState = ST_CLOSED;
            if (x === RETURN_SENTINEL) {
              return {
                value: ctx.returnValue,
                done: true
              };
            }
            throw x;
          }
          if (x !== undefined)
            throw $TypeError('Sent value to newborn generator');
        case ST_SUSPENDED:
          ctx.GState = ST_EXECUTING;
          ctx.action = action;
          ctx.sent = x;
          var value;
          try {
            value = moveNext(ctx);
          } catch (ex) {
            if (ex === RETURN_SENTINEL) {
              value = ctx;
            } else {
              throw ex;
            }
          }
          var done = value === ctx;
          if (done)
            value = ctx.returnValue;
          ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
          return {
            value: value,
            done: done
          };
      }
    }
    var ctxName = createPrivateSymbol();
    var moveNextName = createPrivateSymbol();
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    defineProperty(GeneratorFunctionPrototype, 'constructor', nonEnum(GeneratorFunction));
    GeneratorFunctionPrototype.prototype = {
      constructor: GeneratorFunctionPrototype,
      next: function(v) {
        return nextOrThrow(getPrivate(this, ctxName), getPrivate(this, moveNextName), 'next', v);
      },
      throw: function(v) {
        return nextOrThrow(getPrivate(this, ctxName), getPrivate(this, moveNextName), 'throw', v);
      },
      return: function(v) {
        var ctx = getPrivate(this, ctxName);
        ctx.oldReturnValue = ctx.returnValue;
        ctx.returnValue = v;
        return nextOrThrow(ctx, getPrivate(this, moveNextName), 'throw', RETURN_SENTINEL);
      }
    };
    defineProperties(GeneratorFunctionPrototype.prototype, {
      constructor: {enumerable: false},
      next: {enumerable: false},
      throw: {enumerable: false},
      return: {enumerable: false}
    });
    Object.defineProperty(GeneratorFunctionPrototype.prototype, Symbol.iterator, nonEnum(function() {
      return this;
    }));
    function createGeneratorInstance(innerFunction, functionObject, self) {
      var moveNext = getMoveNext(innerFunction, self);
      var ctx = new GeneratorContext();
      var object = create(functionObject.prototype);
      setPrivate(object, ctxName, ctx);
      setPrivate(object, moveNextName, moveNext);
      return object;
    }
    function initGeneratorFunction(functionObject) {
      functionObject.prototype = create(GeneratorFunctionPrototype.prototype);
      functionObject.__proto__ = GeneratorFunctionPrototype;
      return functionObject;
    }
    function AsyncFunctionContext() {
      GeneratorContext.call(this);
      this.err = undefined;
      var ctx = this;
      ctx.result = new Promise(function(resolve, reject) {
        ctx.resolve = resolve;
        ctx.reject = reject;
      });
    }
    AsyncFunctionContext.prototype = create(GeneratorContext.prototype);
    AsyncFunctionContext.prototype.end = function() {
      switch (this.state) {
        case END_STATE:
          this.resolve(this.returnValue);
          break;
        case RETHROW_STATE:
          this.reject(this.storedException);
          break;
        default:
          this.reject(getInternalError(this.state));
      }
    };
    AsyncFunctionContext.prototype.handleException = function() {
      this.state = RETHROW_STATE;
    };
    function asyncWrap(innerFunction, self) {
      var moveNext = getMoveNext(innerFunction, self);
      var ctx = new AsyncFunctionContext();
      ctx.createCallback = function(newState) {
        return function(value) {
          ctx.state = newState;
          ctx.value = value;
          moveNext(ctx);
        };
      };
      ctx.errback = function(err) {
        handleCatch(ctx, err);
        moveNext(ctx);
      };
      moveNext(ctx);
      return ctx.result;
    }
    function getMoveNext(innerFunction, self) {
      return function(ctx) {
        while (true) {
          try {
            return innerFunction.call(self, ctx);
          } catch (ex) {
            handleCatch(ctx, ex);
          }
        }
      };
    }
    function handleCatch(ctx, ex) {
      ctx.storedException = ex;
      var last = ctx.tryStack_[ctx.tryStack_.length - 1];
      if (!last) {
        ctx.handleException(ex);
        return;
      }
      ctx.state = last.catch !== undefined ? last.catch : last.finally;
      if (last.finallyFallThrough !== undefined)
        ctx.finallyFallThrough = last.finallyFallThrough;
    }
    return {
      get createGeneratorInstance() {
        return createGeneratorInstance;
      },
      get initGeneratorFunction() {
        return initGeneratorFunction;
      },
      get asyncWrap() {
        return asyncWrap;
      }
    };
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/asyncWrap.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/asyncWrap.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_generators_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./generators.js", "traceur-runtime@0.0.108/src/runtime/modules/asyncWrap.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_generators_46_js__.asyncWrap;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/initGeneratorFunction.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/initGeneratorFunction.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_generators_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./generators.js", "traceur-runtime@0.0.108/src/runtime/modules/initGeneratorFunction.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_generators_46_js__.initGeneratorFunction;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/createGeneratorInstance.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/createGeneratorInstance.js";
    var $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_generators_46_js__ = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./generators.js", "traceur-runtime@0.0.108/src/runtime/modules/createGeneratorInstance.js"));
    return {get default() {
        return $__traceur_45_runtime_64_0_46_0_46_108_47_src_47_runtime_47_modules_47_generators_46_js__.createGeneratorInstance;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/generators.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/generators.js";
    var asyncWrap = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/asyncWrap.js", "traceur-runtime@0.0.108/src/runtime/generators.js")).default;
    var initGeneratorFunction = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/initGeneratorFunction.js", "traceur-runtime@0.0.108/src/runtime/generators.js")).default;
    var createGeneratorInstance = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/createGeneratorInstance.js", "traceur-runtime@0.0.108/src/runtime/generators.js")).default;
    $traceurRuntime.asyncWrap = asyncWrap;
    $traceurRuntime.initGeneratorFunction = initGeneratorFunction;
    $traceurRuntime.createGeneratorInstance = createGeneratorInstance;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/spawn.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/spawn.js";
    function spawn(self, args, gen) {
      return new Promise(function(resolve, reject) {
        function fulfill(v) {
          try {
            step(gen.next(v));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(v) {
          try {
            step(gen.throw(v));
          } catch (e) {
            reject(e);
          }
        }
        function step(res) {
          if (res.done) {
            resolve(res.value);
          } else {
            Promise.resolve(res.value).then(fulfill, rejected);
          }
        }
        step((gen = gen.apply(self, args)).next());
      });
    }
    var $__default = spawn;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/spawn.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/spawn.js";
    var spawn = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/spawn.js", "traceur-runtime@0.0.108/src/runtime/spawn.js")).default;
    $traceurRuntime.spawn = spawn;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/getTemplateObject.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/getTemplateObject.js";
    var $__1 = Object,
        defineProperty = $__1.defineProperty,
        freeze = $__1.freeze;
    var slice = Array.prototype.slice;
    var map = Object.create(null);
    function getTemplateObject(raw) {
      var cooked = arguments[1];
      var key = raw.join('${}');
      var templateObject = map[key];
      if (templateObject)
        return templateObject;
      if (!cooked) {
        cooked = slice.call(raw);
      }
      return map[key] = freeze(defineProperty(cooked, 'raw', {value: freeze(raw)}));
    }
    var $__default = getTemplateObject;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/template.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/template.js";
    var getTemplateObject = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/getTemplateObject.js", "traceur-runtime@0.0.108/src/runtime/template.js")).default;
    $traceurRuntime.getTemplateObject = getTemplateObject;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/modules/spreadProperties.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/modules/spreadProperties.js";
    var $__1 = Object,
        defineProperty = $__1.defineProperty,
        getOwnPropertyNames = $__1.getOwnPropertyNames,
        getOwnPropertySymbols = $__1.getOwnPropertySymbols,
        propertyIsEnumerable = $__1.propertyIsEnumerable;
    function createDataProperty(o, p, v) {
      defineProperty(o, p, {
        configurable: true,
        enumerable: true,
        value: v,
        writable: true
      });
    }
    function copyDataProperties(target, source) {
      if (source == null) {
        return;
      }
      var copy = function(keys) {
        for (var i = 0; i < keys.length; i++) {
          var nextKey = keys[i];
          if (propertyIsEnumerable.call(source, nextKey)) {
            var propValue = source[nextKey];
            createDataProperty(target, nextKey, propValue);
          }
        }
      };
      copy(getOwnPropertyNames(source));
      copy(getOwnPropertySymbols(source));
    }
    var $__default = function() {
      var target = arguments[0];
      for (var i = 1; i < arguments.length; i++) {
        copyDataProperties(target, arguments[i]);
      }
      return target;
    };
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/jsx.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/jsx.js";
    var spreadProperties = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./modules/spreadProperties.js", "traceur-runtime@0.0.108/src/runtime/jsx.js")).default;
    $traceurRuntime.spreadProperties = spreadProperties;
    return {};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/runtime-modules.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/runtime-modules.js";
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./symbols.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./classes.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./exportStar.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./properTailCalls.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./relativeRequire.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./spread.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./destructuring.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./async.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./generators.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./spawn.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./template.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./jsx.js", "traceur-runtime@0.0.108/src/runtime/runtime-modules.js"));
    return {};
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/runtime-modules.js" + '');
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/frozen-data.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/frozen-data.js";
    function findIndex(arr, key) {
      for (var i = 0; i < arr.length; i += 2) {
        if (arr[i] === key) {
          return i;
        }
      }
      return -1;
    }
    function setFrozen(arr, key, val) {
      var i = findIndex(arr, key);
      if (i === -1) {
        arr.push(key, val);
      }
    }
    function getFrozen(arr, key) {
      var i = findIndex(arr, key);
      if (i !== -1) {
        return arr[i + 1];
      }
      return undefined;
    }
    function hasFrozen(arr, key) {
      return findIndex(arr, key) !== -1;
    }
    function deleteFrozen(arr, key) {
      var i = findIndex(arr, key);
      if (i !== -1) {
        arr.splice(i, 2);
        return true;
      }
      return false;
    }
    return {
      get setFrozen() {
        return setFrozen;
      },
      get getFrozen() {
        return getFrozen;
      },
      get hasFrozen() {
        return hasFrozen;
      },
      get deleteFrozen() {
        return deleteFrozen;
      }
    };
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/utils.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/utils.js";
    var $ceil = Math.ceil;
    var $floor = Math.floor;
    var $isFinite = isFinite;
    var $isNaN = isNaN;
    var $pow = Math.pow;
    var $min = Math.min;
    var $TypeError = TypeError;
    var $Object = Object;
    function toObject(x) {
      if (x == null) {
        throw $TypeError();
      }
      return $Object(x);
    }
    function toUint32(x) {
      return x >>> 0;
    }
    function isObject(x) {
      return x && (typeof x === 'object' || typeof x === 'function');
    }
    function isCallable(x) {
      return typeof x === 'function';
    }
    function isNumber(x) {
      return typeof x === 'number';
    }
    function toInteger(x) {
      x = +x;
      if ($isNaN(x))
        return 0;
      if (x === 0 || !$isFinite(x))
        return x;
      return x > 0 ? $floor(x) : $ceil(x);
    }
    var MAX_SAFE_LENGTH = $pow(2, 53) - 1;
    function toLength(x) {
      var len = toInteger(x);
      return len < 0 ? 0 : $min(len, MAX_SAFE_LENGTH);
    }
    function checkIterable(x) {
      return !isObject(x) ? undefined : x[Symbol.iterator];
    }
    function isConstructor(x) {
      return isCallable(x);
    }
    function createIteratorResultObject(value, done) {
      return {
        value: value,
        done: done
      };
    }
    function maybeDefine(object, name, descr) {
      if (!(name in object)) {
        Object.defineProperty(object, name, descr);
      }
    }
    function maybeDefineMethod(object, name, value) {
      maybeDefine(object, name, {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
    function maybeDefineConst(object, name, value) {
      maybeDefine(object, name, {
        value: value,
        configurable: false,
        enumerable: false,
        writable: false
      });
    }
    function maybeAddFunctions(object, functions) {
      for (var i = 0; i < functions.length; i += 2) {
        var name = functions[i];
        var value = functions[i + 1];
        maybeDefineMethod(object, name, value);
      }
    }
    function maybeAddConsts(object, consts) {
      for (var i = 0; i < consts.length; i += 2) {
        var name = consts[i];
        var value = consts[i + 1];
        maybeDefineConst(object, name, value);
      }
    }
    function maybeAddIterator(object, func, Symbol) {
      if (!Symbol || !Symbol.iterator || object[Symbol.iterator])
        return;
      if (object['@@iterator'])
        func = object['@@iterator'];
      Object.defineProperty(object, Symbol.iterator, {
        value: func,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
    var polyfills = [];
    function registerPolyfill(func) {
      polyfills.push(func);
    }
    function polyfillAll(global) {
      polyfills.forEach(function(f) {
        return f(global);
      });
    }
    return {
      get toObject() {
        return toObject;
      },
      get toUint32() {
        return toUint32;
      },
      get isObject() {
        return isObject;
      },
      get isCallable() {
        return isCallable;
      },
      get isNumber() {
        return isNumber;
      },
      get toInteger() {
        return toInteger;
      },
      get toLength() {
        return toLength;
      },
      get checkIterable() {
        return checkIterable;
      },
      get isConstructor() {
        return isConstructor;
      },
      get createIteratorResultObject() {
        return createIteratorResultObject;
      },
      get maybeDefine() {
        return maybeDefine;
      },
      get maybeDefineMethod() {
        return maybeDefineMethod;
      },
      get maybeDefineConst() {
        return maybeDefineConst;
      },
      get maybeAddFunctions() {
        return maybeAddFunctions;
      },
      get maybeAddConsts() {
        return maybeAddConsts;
      },
      get maybeAddIterator() {
        return maybeAddIterator;
      },
      get registerPolyfill() {
        return registerPolyfill;
      },
      get polyfillAll() {
        return polyfillAll;
      }
    };
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/Map.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/Map.js";
    var $__16 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../private.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Map.js")),
        createPrivateSymbol = $__16.createPrivateSymbol,
        getPrivate = $__16.getPrivate,
        setPrivate = $__16.setPrivate;
    var $__17 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../frozen-data.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Map.js")),
        deleteFrozen = $__17.deleteFrozen,
        getFrozen = $__17.getFrozen,
        setFrozen = $__17.setFrozen;
    var $__18 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Map.js")),
        isObject = $__18.isObject,
        registerPolyfill = $__18.registerPolyfill;
    var hasNativeSymbol = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../has-native-symbols.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Map.js")).default;
    var $__9 = Object,
        defineProperty = $__9.defineProperty,
        getOwnPropertyDescriptor = $__9.getOwnPropertyDescriptor,
        hasOwnProperty = $__9.hasOwnProperty,
        isExtensible = $__9.isExtensible;
    var deletedSentinel = {};
    var counter = 1;
    var hashCodeName = createPrivateSymbol();
    function getHashCodeForObject(obj) {
      return getPrivate(obj, hashCodeName);
    }
    function getOrSetHashCodeForObject(obj) {
      var hash = getHashCodeForObject(obj);
      if (!hash) {
        hash = counter++;
        setPrivate(obj, hashCodeName, hash);
      }
      return hash;
    }
    function lookupIndex(map, key) {
      if (typeof key === 'string') {
        return map.stringIndex_[key];
      }
      if (isObject(key)) {
        if (!isExtensible(key)) {
          return getFrozen(map.frozenData_, key);
        }
        var hc = getHashCodeForObject(key);
        if (hc === undefined) {
          return undefined;
        }
        return map.objectIndex_[hc];
      }
      return map.primitiveIndex_[key];
    }
    function initMap(map) {
      map.entries_ = [];
      map.objectIndex_ = Object.create(null);
      map.stringIndex_ = Object.create(null);
      map.primitiveIndex_ = Object.create(null);
      map.frozenData_ = [];
      map.deletedCount_ = 0;
    }
    var Map = function() {
      function Map() {
        var $__11,
            $__12;
        var iterable = arguments[0];
        if (!isObject(this))
          throw new TypeError('Map called on incompatible type');
        if (hasOwnProperty.call(this, 'entries_')) {
          throw new TypeError('Map can not be reentrantly initialised');
        }
        initMap(this);
        if (iterable !== null && iterable !== undefined) {
          var $__5 = true;
          var $__6 = false;
          var $__7 = undefined;
          try {
            for (var $__3 = void 0,
                $__2 = (iterable)[Symbol.iterator](); !($__5 = ($__3 = $__2.next()).done); $__5 = true) {
              var $__10 = $__3.value,
                  key = ($__11 = $__10[Symbol.iterator](), ($__12 = $__11.next()).done ? void 0 : $__12.value),
                  value = ($__12 = $__11.next()).done ? void 0 : $__12.value;
              {
                this.set(key, value);
              }
            }
          } catch ($__8) {
            $__6 = true;
            $__7 = $__8;
          } finally {
            try {
              if (!$__5 && $__2.return != null) {
                $__2.return();
              }
            } finally {
              if ($__6) {
                throw $__7;
              }
            }
          }
        }
      }
      return ($traceurRuntime.createClass)(Map, {
        get size() {
          return this.entries_.length / 2 - this.deletedCount_;
        },
        get: function(key) {
          var index = lookupIndex(this, key);
          if (index !== undefined) {
            return this.entries_[index + 1];
          }
        },
        set: function(key, value) {
          var index = lookupIndex(this, key);
          if (index !== undefined) {
            this.entries_[index + 1] = value;
          } else {
            index = this.entries_.length;
            this.entries_[index] = key;
            this.entries_[index + 1] = value;
            if (isObject(key)) {
              if (!isExtensible(key)) {
                setFrozen(this.frozenData_, key, index);
              } else {
                var hash = getOrSetHashCodeForObject(key);
                this.objectIndex_[hash] = index;
              }
            } else if (typeof key === 'string') {
              this.stringIndex_[key] = index;
            } else {
              this.primitiveIndex_[key] = index;
            }
          }
          return this;
        },
        has: function(key) {
          return lookupIndex(this, key) !== undefined;
        },
        delete: function(key) {
          var index = lookupIndex(this, key);
          if (index === undefined) {
            return false;
          }
          this.entries_[index] = deletedSentinel;
          this.entries_[index + 1] = undefined;
          this.deletedCount_++;
          if (isObject(key)) {
            if (!isExtensible(key)) {
              deleteFrozen(this.frozenData_, key);
            } else {
              var hash = getHashCodeForObject(key);
              delete this.objectIndex_[hash];
            }
          } else if (typeof key === 'string') {
            delete this.stringIndex_[key];
          } else {
            delete this.primitiveIndex_[key];
          }
          return true;
        },
        clear: function() {
          initMap(this);
        },
        forEach: function(callbackFn) {
          var thisArg = arguments[1];
          for (var i = 0; i < this.entries_.length; i += 2) {
            var key = this.entries_[i];
            var value = this.entries_[i + 1];
            if (key === deletedSentinel)
              continue;
            callbackFn.call(thisArg, value, key, this);
          }
        },
        entries: $traceurRuntime.initGeneratorFunction(function $__13() {
          var i,
              key,
              value;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  i = 0;
                  $ctx.state = 12;
                  break;
                case 12:
                  $ctx.state = (i < this.entries_.length) ? 8 : -2;
                  break;
                case 4:
                  i += 2;
                  $ctx.state = 12;
                  break;
                case 8:
                  key = this.entries_[i];
                  value = this.entries_[i + 1];
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = (key === deletedSentinel) ? 4 : 6;
                  break;
                case 6:
                  $ctx.state = 2;
                  return [key, value];
                case 2:
                  $ctx.maybeThrow();
                  $ctx.state = 4;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__13, this);
        }),
        keys: $traceurRuntime.initGeneratorFunction(function $__14() {
          var i,
              key,
              value;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  i = 0;
                  $ctx.state = 12;
                  break;
                case 12:
                  $ctx.state = (i < this.entries_.length) ? 8 : -2;
                  break;
                case 4:
                  i += 2;
                  $ctx.state = 12;
                  break;
                case 8:
                  key = this.entries_[i];
                  value = this.entries_[i + 1];
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = (key === deletedSentinel) ? 4 : 6;
                  break;
                case 6:
                  $ctx.state = 2;
                  return key;
                case 2:
                  $ctx.maybeThrow();
                  $ctx.state = 4;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__14, this);
        }),
        values: $traceurRuntime.initGeneratorFunction(function $__15() {
          var i,
              key,
              value;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  i = 0;
                  $ctx.state = 12;
                  break;
                case 12:
                  $ctx.state = (i < this.entries_.length) ? 8 : -2;
                  break;
                case 4:
                  i += 2;
                  $ctx.state = 12;
                  break;
                case 8:
                  key = this.entries_[i];
                  value = this.entries_[i + 1];
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = (key === deletedSentinel) ? 4 : 6;
                  break;
                case 6:
                  $ctx.state = 2;
                  return value;
                case 2:
                  $ctx.maybeThrow();
                  $ctx.state = 4;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__15, this);
        })
      }, {});
    }();
    defineProperty(Map.prototype, Symbol.iterator, {
      configurable: true,
      writable: true,
      value: Map.prototype.entries
    });
    function needsPolyfill(global) {
      var $__10 = global,
          Map = $__10.Map,
          Symbol = $__10.Symbol;
      if (!Map || !hasNativeSymbol() || !Map.prototype[Symbol.iterator] || !Map.prototype.entries) {
        return true;
      }
      try {
        return new Map([[]]).size !== 1;
      } catch (e) {
        return false;
      }
    }
    function polyfillMap(global) {
      if (needsPolyfill(global)) {
        global.Map = Map;
      }
    }
    registerPolyfill(polyfillMap);
    return {
      get Map() {
        return Map;
      },
      get polyfillMap() {
        return polyfillMap;
      }
    };
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/polyfills/Map.js" + '');
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/Set.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/Set.js";
    var $__18 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Set.js")),
        isObject = $__18.isObject,
        registerPolyfill = $__18.registerPolyfill;
    var Map = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./Map.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Set.js")).Map;
    var hasNativeSymbol = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../has-native-symbols.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Set.js")).default;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var Set = function() {
      function Set() {
        var iterable = arguments[0];
        if (!isObject(this))
          throw new TypeError('Set called on incompatible type');
        if (hasOwnProperty.call(this, 'map_')) {
          throw new TypeError('Set can not be reentrantly initialised');
        }
        this.map_ = new Map();
        if (iterable !== null && iterable !== undefined) {
          var $__6 = true;
          var $__7 = false;
          var $__8 = undefined;
          try {
            for (var $__4 = void 0,
                $__3 = (iterable)[Symbol.iterator](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
              var item = $__4.value;
              {
                this.add(item);
              }
            }
          } catch ($__9) {
            $__7 = true;
            $__8 = $__9;
          } finally {
            try {
              if (!$__6 && $__3.return != null) {
                $__3.return();
              }
            } finally {
              if ($__7) {
                throw $__8;
              }
            }
          }
        }
      }
      return ($traceurRuntime.createClass)(Set, {
        get size() {
          return this.map_.size;
        },
        has: function(key) {
          return this.map_.has(key);
        },
        add: function(key) {
          this.map_.set(key, key);
          return this;
        },
        delete: function(key) {
          return this.map_.delete(key);
        },
        clear: function() {
          return this.map_.clear();
        },
        forEach: function(callbackFn) {
          var thisArg = arguments[1];
          var $__2 = this;
          return this.map_.forEach(function(value, key) {
            callbackFn.call(thisArg, key, key, $__2);
          });
        },
        values: $traceurRuntime.initGeneratorFunction(function $__12() {
          var $__13,
              $__14;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  $__13 = $ctx.wrapYieldStar(this.map_.keys()[Symbol.iterator]());
                  $ctx.sent = void 0;
                  $ctx.action = 'next';
                  $ctx.state = 12;
                  break;
                case 12:
                  $__14 = $__13[$ctx.action]($ctx.sentIgnoreThrow);
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = ($__14.done) ? 3 : 2;
                  break;
                case 3:
                  $ctx.sent = $__14.value;
                  $ctx.state = -2;
                  break;
                case 2:
                  $ctx.state = 12;
                  return $__14.value;
                default:
                  return $ctx.end();
              }
          }, $__12, this);
        }),
        entries: $traceurRuntime.initGeneratorFunction(function $__15() {
          var $__16,
              $__17;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  $__16 = $ctx.wrapYieldStar(this.map_.entries()[Symbol.iterator]());
                  $ctx.sent = void 0;
                  $ctx.action = 'next';
                  $ctx.state = 12;
                  break;
                case 12:
                  $__17 = $__16[$ctx.action]($ctx.sentIgnoreThrow);
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = ($__17.done) ? 3 : 2;
                  break;
                case 3:
                  $ctx.sent = $__17.value;
                  $ctx.state = -2;
                  break;
                case 2:
                  $ctx.state = 12;
                  return $__17.value;
                default:
                  return $ctx.end();
              }
          }, $__15, this);
        })
      }, {});
    }();
    Object.defineProperty(Set.prototype, Symbol.iterator, {
      configurable: true,
      writable: true,
      value: Set.prototype.values
    });
    Object.defineProperty(Set.prototype, 'keys', {
      configurable: true,
      writable: true,
      value: Set.prototype.values
    });
    function needsPolyfill(global) {
      var $__11 = global,
          Set = $__11.Set,
          Symbol = $__11.Symbol;
      if (!Set || !hasNativeSymbol() || !Set.prototype[Symbol.iterator] || !Set.prototype.values) {
        return true;
      }
      try {
        return new Set([1]).size !== 1;
      } catch (e) {
        return false;
      }
    }
    function polyfillSet(global) {
      if (needsPolyfill(global)) {
        global.Set = Set;
      }
    }
    registerPolyfill(polyfillSet);
    return {
      get Set() {
        return Set;
      },
      get polyfillSet() {
        return polyfillSet;
      }
    };
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/polyfills/Set.js" + '');
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/node_modules/rsvp/lib/rsvp/asap.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/node_modules/rsvp/lib/rsvp/asap.js";
    var len = 0;
    var toString = {}.toString;
    var vertxNext;
    function asap(callback, arg) {
      queue[len] = callback;
      queue[len + 1] = arg;
      len += 2;
      if (len === 2) {
        scheduleFlush();
      }
    }
    var $__default = asap;
    var browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var browserGlobal = browserWindow || {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';
    var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
    function useNextTick() {
      var nextTick = process.nextTick;
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(flush);
      };
    }
    function useVertxTimer() {
      return function() {
        vertxNext(flush);
      };
    }
    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, {characterData: true});
      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }
    function useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = flush;
      return function() {
        channel.port2.postMessage(0);
      };
    }
    function useSetTimeout() {
      return function() {
        setTimeout(flush, 1);
      };
    }
    var queue = new Array(1000);
    function flush() {
      for (var i = 0; i < len; i += 2) {
        var callback = queue[i];
        var arg = queue[i + 1];
        callback(arg);
        queue[i] = undefined;
        queue[i + 1] = undefined;
      }
      len = 0;
    }
    function attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return useVertxTimer();
      } catch (e) {
        return useSetTimeout();
      }
    }
    var scheduleFlush;
    if (isNode) {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else if (isWorker) {
      scheduleFlush = useMessageChannel();
    } else if (browserWindow === undefined && typeof require === 'function') {
      scheduleFlush = attemptVertex();
    } else {
      scheduleFlush = useSetTimeout();
    }
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/Promise.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/Promise.js";
    var async = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../../../node_modules/rsvp/lib/rsvp/asap.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Promise.js")).default;
    var $__9 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Promise.js")),
        isObject = $__9.isObject,
        registerPolyfill = $__9.registerPolyfill;
    var $__10 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../private.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Promise.js")),
        createPrivateSymbol = $__10.createPrivateSymbol,
        getPrivate = $__10.getPrivate,
        setPrivate = $__10.setPrivate;
    var promiseRaw = {};
    function isPromise(x) {
      return x && typeof x === 'object' && x.status_ !== undefined;
    }
    function idResolveHandler(x) {
      return x;
    }
    function idRejectHandler(x) {
      throw x;
    }
    function chain(promise) {
      var onResolve = arguments[1] !== (void 0) ? arguments[1] : idResolveHandler;
      var onReject = arguments[2] !== (void 0) ? arguments[2] : idRejectHandler;
      var deferred = getDeferred(promise.constructor);
      switch (promise.status_) {
        case undefined:
          throw TypeError;
        case 0:
          promise.onResolve_.push(onResolve, deferred);
          promise.onReject_.push(onReject, deferred);
          break;
        case +1:
          promiseEnqueue(promise.value_, [onResolve, deferred]);
          break;
        case -1:
          promiseEnqueue(promise.value_, [onReject, deferred]);
          break;
      }
      return deferred.promise;
    }
    function getDeferred(C) {
      if (this === $Promise) {
        var promise = promiseInit(new $Promise(promiseRaw));
        return {
          promise: promise,
          resolve: function(x) {
            promiseResolve(promise, x);
          },
          reject: function(r) {
            promiseReject(promise, r);
          }
        };
      } else {
        var result = {};
        result.promise = new C(function(resolve, reject) {
          result.resolve = resolve;
          result.reject = reject;
        });
        return result;
      }
    }
    function promiseSet(promise, status, value, onResolve, onReject) {
      promise.status_ = status;
      promise.value_ = value;
      promise.onResolve_ = onResolve;
      promise.onReject_ = onReject;
      return promise;
    }
    function promiseInit(promise) {
      return promiseSet(promise, 0, undefined, [], []);
    }
    var Promise = function() {
      function Promise(resolver) {
        if (resolver === promiseRaw)
          return;
        if (typeof resolver !== 'function')
          throw new TypeError;
        var promise = promiseInit(this);
        try {
          resolver(function(x) {
            promiseResolve(promise, x);
          }, function(r) {
            promiseReject(promise, r);
          });
        } catch (e) {
          promiseReject(promise, e);
        }
      }
      return ($traceurRuntime.createClass)(Promise, {
        catch: function(onReject) {
          return this.then(undefined, onReject);
        },
        then: function(onResolve, onReject) {
          if (typeof onResolve !== 'function')
            onResolve = idResolveHandler;
          if (typeof onReject !== 'function')
            onReject = idRejectHandler;
          var that = this;
          var constructor = this.constructor;
          return chain(this, function(x) {
            x = promiseCoerce(constructor, x);
            return x === that ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
          }, onReject);
        }
      }, {
        resolve: function(x) {
          if (this === $Promise) {
            if (isPromise(x)) {
              return x;
            }
            return promiseSet(new $Promise(promiseRaw), +1, x);
          } else {
            return new this(function(resolve, reject) {
              resolve(x);
            });
          }
        },
        reject: function(r) {
          if (this === $Promise) {
            return promiseSet(new $Promise(promiseRaw), -1, r);
          } else {
            return new this(function(resolve, reject) {
              reject(r);
            });
          }
        },
        all: function(values) {
          var deferred = getDeferred(this);
          var resolutions = [];
          try {
            var makeCountdownFunction = function(i) {
              return function(x) {
                resolutions[i] = x;
                if (--count === 0)
                  deferred.resolve(resolutions);
              };
            };
            var count = 0;
            var i = 0;
            var $__4 = true;
            var $__5 = false;
            var $__6 = undefined;
            try {
              for (var $__2 = void 0,
                  $__1 = (values)[Symbol.iterator](); !($__4 = ($__2 = $__1.next()).done); $__4 = true) {
                var value = $__2.value;
                {
                  var countdownFunction = makeCountdownFunction(i);
                  this.resolve(value).then(countdownFunction, function(r) {
                    deferred.reject(r);
                  });
                  ++i;
                  ++count;
                }
              }
            } catch ($__7) {
              $__5 = true;
              $__6 = $__7;
            } finally {
              try {
                if (!$__4 && $__1.return != null) {
                  $__1.return();
                }
              } finally {
                if ($__5) {
                  throw $__6;
                }
              }
            }
            if (count === 0) {
              deferred.resolve(resolutions);
            }
          } catch (e) {
            deferred.reject(e);
          }
          return deferred.promise;
        },
        race: function(values) {
          var deferred = getDeferred(this);
          try {
            for (var i = 0; i < values.length; i++) {
              this.resolve(values[i]).then(function(x) {
                deferred.resolve(x);
              }, function(r) {
                deferred.reject(r);
              });
            }
          } catch (e) {
            deferred.reject(e);
          }
          return deferred.promise;
        }
      });
    }();
    var $Promise = Promise;
    var $PromiseReject = $Promise.reject;
    function promiseResolve(promise, x) {
      promiseDone(promise, +1, x, promise.onResolve_);
    }
    function promiseReject(promise, r) {
      promiseDone(promise, -1, r, promise.onReject_);
    }
    function promiseDone(promise, status, value, reactions) {
      if (promise.status_ !== 0)
        return;
      promiseEnqueue(value, reactions);
      promiseSet(promise, status, value);
    }
    function promiseEnqueue(value, tasks) {
      async(function() {
        for (var i = 0; i < tasks.length; i += 2) {
          promiseHandle(value, tasks[i], tasks[i + 1]);
        }
      });
    }
    function promiseHandle(value, handler, deferred) {
      try {
        var result = handler(value);
        if (result === deferred.promise)
          throw new TypeError;
        else if (isPromise(result))
          chain(result, deferred.resolve, deferred.reject);
        else
          deferred.resolve(result);
      } catch (e) {
        try {
          deferred.reject(e);
        } catch (e) {}
      }
    }
    var thenableSymbol = createPrivateSymbol();
    function promiseCoerce(constructor, x) {
      if (!isPromise(x) && isObject(x)) {
        var then;
        try {
          then = x.then;
        } catch (r) {
          var promise = $PromiseReject.call(constructor, r);
          setPrivate(x, thenableSymbol, promise);
          return promise;
        }
        if (typeof then === 'function') {
          var p = getPrivate(x, thenableSymbol);
          if (p) {
            return p;
          } else {
            var deferred = getDeferred(constructor);
            setPrivate(x, thenableSymbol, deferred.promise);
            try {
              then.call(x, deferred.resolve, deferred.reject);
            } catch (r) {
              deferred.reject(r);
            }
            return deferred.promise;
          }
        }
      }
      return x;
    }
    function polyfillPromise(global) {
      if (!global.Promise)
        global.Promise = Promise;
    }
    registerPolyfill(polyfillPromise);
    return {
      get Promise() {
        return Promise;
      },
      get polyfillPromise() {
        return polyfillPromise;
      }
    };
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/polyfills/Promise.js" + '');
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/StringIterator.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/StringIterator.js";
    var $__3 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/StringIterator.js")),
        createIteratorResultObject = $__3.createIteratorResultObject,
        isObject = $__3.isObject;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var iteratedString = Symbol('iteratedString');
    var stringIteratorNextIndex = Symbol('stringIteratorNextIndex');
    var StringIterator = function() {
      var $__1;
      function StringIterator() {}
      return ($traceurRuntime.createClass)(StringIterator, ($__1 = {}, Object.defineProperty($__1, "next", {
        value: function() {
          var o = this;
          if (!isObject(o) || !hasOwnProperty.call(o, iteratedString)) {
            throw new TypeError('this must be a StringIterator object');
          }
          var s = o[iteratedString];
          if (s === undefined) {
            return createIteratorResultObject(undefined, true);
          }
          var position = o[stringIteratorNextIndex];
          var len = s.length;
          if (position >= len) {
            o[iteratedString] = undefined;
            return createIteratorResultObject(undefined, true);
          }
          var first = s.charCodeAt(position);
          var resultString;
          if (first < 0xD800 || first > 0xDBFF || position + 1 === len) {
            resultString = String.fromCharCode(first);
          } else {
            var second = s.charCodeAt(position + 1);
            if (second < 0xDC00 || second > 0xDFFF) {
              resultString = String.fromCharCode(first);
            } else {
              resultString = String.fromCharCode(first) + String.fromCharCode(second);
            }
          }
          o[stringIteratorNextIndex] = position + resultString.length;
          return createIteratorResultObject(resultString, false);
        },
        configurable: true,
        enumerable: true,
        writable: true
      }), Object.defineProperty($__1, Symbol.iterator, {
        value: function() {
          return this;
        },
        configurable: true,
        enumerable: true,
        writable: true
      }), $__1), {});
    }();
    function createStringIterator(string) {
      var s = String(string);
      var iterator = Object.create(StringIterator.prototype);
      iterator[iteratedString] = s;
      iterator[stringIteratorNextIndex] = 0;
      return iterator;
    }
    return {get createStringIterator() {
        return createStringIterator;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/String.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/String.js";
    var checkObjectCoercible = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../checkObjectCoercible.js", "traceur-runtime@0.0.108/src/runtime/polyfills/String.js")).default;
    var createStringIterator = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./StringIterator.js", "traceur-runtime@0.0.108/src/runtime/polyfills/String.js")).createStringIterator;
    var $__3 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/String.js")),
        maybeAddFunctions = $__3.maybeAddFunctions,
        maybeAddIterator = $__3.maybeAddIterator,
        registerPolyfill = $__3.registerPolyfill;
    var $toString = Object.prototype.toString;
    var $indexOf = String.prototype.indexOf;
    var $lastIndexOf = String.prototype.lastIndexOf;
    function startsWith(search) {
      var string = String(this);
      if (this == null || $toString.call(search) == '[object RegExp]') {
        throw TypeError();
      }
      var stringLength = string.length;
      var searchString = String(search);
      var searchLength = searchString.length;
      var position = arguments.length > 1 ? arguments[1] : undefined;
      var pos = position ? Number(position) : 0;
      if (isNaN(pos)) {
        pos = 0;
      }
      var start = Math.min(Math.max(pos, 0), stringLength);
      return $indexOf.call(string, searchString, pos) == start;
    }
    function endsWith(search) {
      var string = String(this);
      if (this == null || $toString.call(search) == '[object RegExp]') {
        throw TypeError();
      }
      var stringLength = string.length;
      var searchString = String(search);
      var searchLength = searchString.length;
      var pos = stringLength;
      if (arguments.length > 1) {
        var position = arguments[1];
        if (position !== undefined) {
          pos = position ? Number(position) : 0;
          if (isNaN(pos)) {
            pos = 0;
          }
        }
      }
      var end = Math.min(Math.max(pos, 0), stringLength);
      var start = end - searchLength;
      if (start < 0) {
        return false;
      }
      return $lastIndexOf.call(string, searchString, start) == start;
    }
    function includes(search) {
      if (this == null) {
        throw TypeError();
      }
      var string = String(this);
      if (search && $toString.call(search) == '[object RegExp]') {
        throw TypeError();
      }
      var stringLength = string.length;
      var searchString = String(search);
      var searchLength = searchString.length;
      var position = arguments.length > 1 ? arguments[1] : undefined;
      var pos = position ? Number(position) : 0;
      if (pos != pos) {
        pos = 0;
      }
      var start = Math.min(Math.max(pos, 0), stringLength);
      if (searchLength + start > stringLength) {
        return false;
      }
      return $indexOf.call(string, searchString, pos) != -1;
    }
    function repeat(count) {
      if (this == null) {
        throw TypeError();
      }
      var string = String(this);
      var n = count ? Number(count) : 0;
      if (isNaN(n)) {
        n = 0;
      }
      if (n < 0 || n == Infinity) {
        throw RangeError();
      }
      if (n == 0) {
        return '';
      }
      var result = '';
      while (n--) {
        result += string;
      }
      return result;
    }
    function codePointAt(position) {
      if (this == null) {
        throw TypeError();
      }
      var string = String(this);
      var size = string.length;
      var index = position ? Number(position) : 0;
      if (isNaN(index)) {
        index = 0;
      }
      if (index < 0 || index >= size) {
        return undefined;
      }
      var first = string.charCodeAt(index);
      var second;
      if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
        second = string.charCodeAt(index + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) {
          return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
        }
      }
      return first;
    }
    function raw(callsite) {
      var raw = callsite.raw;
      var len = raw.length >>> 0;
      if (len === 0)
        return '';
      var s = '';
      var i = 0;
      while (true) {
        s += raw[i];
        if (i + 1 === len)
          return s;
        s += arguments[++i];
      }
    }
    function fromCodePoint(_) {
      var codeUnits = [];
      var floor = Math.floor;
      var highSurrogate;
      var lowSurrogate;
      var index = -1;
      var length = arguments.length;
      if (!length) {
        return '';
      }
      while (++index < length) {
        var codePoint = Number(arguments[index]);
        if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
          throw RangeError('Invalid code point: ' + codePoint);
        }
        if (codePoint <= 0xFFFF) {
          codeUnits.push(codePoint);
        } else {
          codePoint -= 0x10000;
          highSurrogate = (codePoint >> 10) + 0xD800;
          lowSurrogate = (codePoint % 0x400) + 0xDC00;
          codeUnits.push(highSurrogate, lowSurrogate);
        }
      }
      return String.fromCharCode.apply(null, codeUnits);
    }
    function stringPrototypeIterator() {
      var o = checkObjectCoercible(this);
      var s = String(o);
      return createStringIterator(s);
    }
    function polyfillString(global) {
      var String = global.String;
      maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'endsWith', endsWith, 'includes', includes, 'repeat', repeat, 'startsWith', startsWith]);
      maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
      maybeAddIterator(String.prototype, stringPrototypeIterator, Symbol);
    }
    registerPolyfill(polyfillString);
    return {
      get startsWith() {
        return startsWith;
      },
      get endsWith() {
        return endsWith;
      },
      get includes() {
        return includes;
      },
      get repeat() {
        return repeat;
      },
      get codePointAt() {
        return codePointAt;
      },
      get raw() {
        return raw;
      },
      get fromCodePoint() {
        return fromCodePoint;
      },
      get stringPrototypeIterator() {
        return stringPrototypeIterator;
      },
      get polyfillString() {
        return polyfillString;
      }
    };
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/polyfills/String.js" + '');
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/ArrayIterator.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/ArrayIterator.js";
    var $__2 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/ArrayIterator.js")),
        toObject = $__2.toObject,
        toUint32 = $__2.toUint32,
        createIteratorResultObject = $__2.createIteratorResultObject;
    var ARRAY_ITERATOR_KIND_KEYS = 1;
    var ARRAY_ITERATOR_KIND_VALUES = 2;
    var ARRAY_ITERATOR_KIND_ENTRIES = 3;
    var ArrayIterator = function() {
      var $__1;
      function ArrayIterator() {}
      return ($traceurRuntime.createClass)(ArrayIterator, ($__1 = {}, Object.defineProperty($__1, "next", {
        value: function() {
          var iterator = toObject(this);
          var array = iterator.iteratorObject_;
          if (!array) {
            throw new TypeError('Object is not an ArrayIterator');
          }
          var index = iterator.arrayIteratorNextIndex_;
          var itemKind = iterator.arrayIterationKind_;
          var length = toUint32(array.length);
          if (index >= length) {
            iterator.arrayIteratorNextIndex_ = Infinity;
            return createIteratorResultObject(undefined, true);
          }
          iterator.arrayIteratorNextIndex_ = index + 1;
          if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
            return createIteratorResultObject(array[index], false);
          if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
            return createIteratorResultObject([index, array[index]], false);
          return createIteratorResultObject(index, false);
        },
        configurable: true,
        enumerable: true,
        writable: true
      }), Object.defineProperty($__1, Symbol.iterator, {
        value: function() {
          return this;
        },
        configurable: true,
        enumerable: true,
        writable: true
      }), $__1), {});
    }();
    function createArrayIterator(array, kind) {
      var object = toObject(array);
      var iterator = new ArrayIterator;
      iterator.iteratorObject_ = object;
      iterator.arrayIteratorNextIndex_ = 0;
      iterator.arrayIterationKind_ = kind;
      return iterator;
    }
    function entries() {
      return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
    }
    function keys() {
      return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
    }
    function values() {
      return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
    }
    return {
      get entries() {
        return entries;
      },
      get keys() {
        return keys;
      },
      get values() {
        return values;
      }
    };
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/Array.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/Array.js";
    var $__9 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./ArrayIterator.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Array.js")),
        entries = $__9.entries,
        keys = $__9.keys,
        jsValues = $__9.values;
    var $__10 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Array.js")),
        checkIterable = $__10.checkIterable,
        isCallable = $__10.isCallable,
        isConstructor = $__10.isConstructor,
        maybeAddFunctions = $__10.maybeAddFunctions,
        maybeAddIterator = $__10.maybeAddIterator,
        registerPolyfill = $__10.registerPolyfill,
        toInteger = $__10.toInteger,
        toLength = $__10.toLength,
        toObject = $__10.toObject;
    function from(arrLike) {
      var mapFn = arguments[1];
      var thisArg = arguments[2];
      var C = this;
      var items = toObject(arrLike);
      var mapping = mapFn !== undefined;
      var k = 0;
      var arr,
          len;
      if (mapping && !isCallable(mapFn)) {
        throw TypeError();
      }
      if (checkIterable(items)) {
        arr = isConstructor(C) ? new C() : [];
        var $__3 = true;
        var $__4 = false;
        var $__5 = undefined;
        try {
          for (var $__1 = void 0,
              $__0 = (items)[Symbol.iterator](); !($__3 = ($__1 = $__0.next()).done); $__3 = true) {
            var item = $__1.value;
            {
              if (mapping) {
                arr[k] = mapFn.call(thisArg, item, k);
              } else {
                arr[k] = item;
              }
              k++;
            }
          }
        } catch ($__6) {
          $__4 = true;
          $__5 = $__6;
        } finally {
          try {
            if (!$__3 && $__0.return != null) {
              $__0.return();
            }
          } finally {
            if ($__4) {
              throw $__5;
            }
          }
        }
        arr.length = k;
        return arr;
      }
      len = toLength(items.length);
      arr = isConstructor(C) ? new C(len) : new Array(len);
      for (; k < len; k++) {
        if (mapping) {
          arr[k] = typeof thisArg === 'undefined' ? mapFn(items[k], k) : mapFn.call(thisArg, items[k], k);
        } else {
          arr[k] = items[k];
        }
      }
      arr.length = len;
      return arr;
    }
    function of() {
      for (var items = [],
          $__7 = 0; $__7 < arguments.length; $__7++)
        items[$__7] = arguments[$__7];
      var C = this;
      var len = items.length;
      var arr = isConstructor(C) ? new C(len) : new Array(len);
      for (var k = 0; k < len; k++) {
        arr[k] = items[k];
      }
      arr.length = len;
      return arr;
    }
    function fill(value) {
      var start = arguments[1] !== (void 0) ? arguments[1] : 0;
      var end = arguments[2];
      var object = toObject(this);
      var len = toLength(object.length);
      var fillStart = toInteger(start);
      var fillEnd = end !== undefined ? toInteger(end) : len;
      fillStart = fillStart < 0 ? Math.max(len + fillStart, 0) : Math.min(fillStart, len);
      fillEnd = fillEnd < 0 ? Math.max(len + fillEnd, 0) : Math.min(fillEnd, len);
      while (fillStart < fillEnd) {
        object[fillStart] = value;
        fillStart++;
      }
      return object;
    }
    function find(predicate) {
      var thisArg = arguments[1];
      return findHelper(this, predicate, thisArg);
    }
    function findIndex(predicate) {
      var thisArg = arguments[1];
      return findHelper(this, predicate, thisArg, true);
    }
    function findHelper(self, predicate) {
      var thisArg = arguments[2];
      var returnIndex = arguments[3] !== (void 0) ? arguments[3] : false;
      var object = toObject(self);
      var len = toLength(object.length);
      if (!isCallable(predicate)) {
        throw TypeError();
      }
      for (var i = 0; i < len; i++) {
        var value = object[i];
        if (predicate.call(thisArg, value, i, object)) {
          return returnIndex ? i : value;
        }
      }
      return returnIndex ? -1 : undefined;
    }
    function polyfillArray(global) {
      var $__8 = global,
          Array = $__8.Array,
          Object = $__8.Object,
          Symbol = $__8.Symbol;
      var values = jsValues;
      if (Symbol && Symbol.iterator && Array.prototype[Symbol.iterator]) {
        values = Array.prototype[Symbol.iterator];
      }
      maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values, 'fill', fill, 'find', find, 'findIndex', findIndex]);
      maybeAddFunctions(Array, ['from', from, 'of', of]);
      maybeAddIterator(Array.prototype, values, Symbol);
      maybeAddIterator(Object.getPrototypeOf([].values()), function() {
        return this;
      }, Symbol);
    }
    registerPolyfill(polyfillArray);
    return {
      get from() {
        return from;
      },
      get of() {
        return of;
      },
      get fill() {
        return fill;
      },
      get find() {
        return find;
      },
      get findIndex() {
        return findIndex;
      },
      get polyfillArray() {
        return polyfillArray;
      }
    };
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/polyfills/Array.js" + '');
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/assign.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/assign.js";
    var keys = Object.keys;
    function assign(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        var props = source == null ? [] : keys(source);
        var p = void 0,
            length = props.length;
        for (p = 0; p < length; p++) {
          var name = props[p];
          target[name] = source[name];
        }
      }
      return target;
    }
    var $__default = assign;
    return {get default() {
        return $__default;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/Object.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/Object.js";
    var $__2 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Object.js")),
        maybeAddFunctions = $__2.maybeAddFunctions,
        registerPolyfill = $__2.registerPolyfill;
    var assign = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./assign.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Object.js")).default;
    var $__0 = Object,
        defineProperty = $__0.defineProperty,
        getOwnPropertyDescriptor = $__0.getOwnPropertyDescriptor,
        getOwnPropertyNames = $__0.getOwnPropertyNames;
    function is(left, right) {
      if (left === right)
        return left !== 0 || 1 / left === 1 / right;
      return left !== left && right !== right;
    }
    function mixin(target, source) {
      var props = getOwnPropertyNames(source);
      var p,
          descriptor,
          length = props.length;
      for (p = 0; p < length; p++) {
        var name = props[p];
        descriptor = getOwnPropertyDescriptor(source, props[p]);
        defineProperty(target, props[p], descriptor);
      }
      return target;
    }
    function polyfillObject(global) {
      var Object = global.Object;
      maybeAddFunctions(Object, ['assign', assign, 'is', is, 'mixin', mixin]);
    }
    registerPolyfill(polyfillObject);
    return {
      get assign() {
        return assign;
      },
      get is() {
        return is;
      },
      get mixin() {
        return mixin;
      },
      get polyfillObject() {
        return polyfillObject;
      }
    };
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/polyfills/Object.js" + '');
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/Number.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/Number.js";
    var $__1 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Number.js")),
        isNumber = $__1.isNumber,
        maybeAddConsts = $__1.maybeAddConsts,
        maybeAddFunctions = $__1.maybeAddFunctions,
        registerPolyfill = $__1.registerPolyfill,
        toInteger = $__1.toInteger;
    var $abs = Math.abs;
    var $isFinite = isFinite;
    var $isNaN = isNaN;
    var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
    var MIN_SAFE_INTEGER = -Math.pow(2, 53) + 1;
    var EPSILON = Math.pow(2, -52);
    function NumberIsFinite(number) {
      return isNumber(number) && $isFinite(number);
    }
    function isInteger(number) {
      return NumberIsFinite(number) && toInteger(number) === number;
    }
    function NumberIsNaN(number) {
      return isNumber(number) && $isNaN(number);
    }
    function isSafeInteger(number) {
      if (NumberIsFinite(number)) {
        var integral = toInteger(number);
        if (integral === number)
          return $abs(integral) <= MAX_SAFE_INTEGER;
      }
      return false;
    }
    function polyfillNumber(global) {
      var Number = global.Number;
      maybeAddConsts(Number, ['MAX_SAFE_INTEGER', MAX_SAFE_INTEGER, 'MIN_SAFE_INTEGER', MIN_SAFE_INTEGER, 'EPSILON', EPSILON]);
      maybeAddFunctions(Number, ['isFinite', NumberIsFinite, 'isInteger', isInteger, 'isNaN', NumberIsNaN, 'isSafeInteger', isSafeInteger]);
    }
    registerPolyfill(polyfillNumber);
    return {
      get MAX_SAFE_INTEGER() {
        return MAX_SAFE_INTEGER;
      },
      get MIN_SAFE_INTEGER() {
        return MIN_SAFE_INTEGER;
      },
      get EPSILON() {
        return EPSILON;
      },
      get isFinite() {
        return NumberIsFinite;
      },
      get isInteger() {
        return isInteger;
      },
      get isNaN() {
        return NumberIsNaN;
      },
      get isSafeInteger() {
        return isSafeInteger;
      },
      get polyfillNumber() {
        return polyfillNumber;
      }
    };
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/polyfills/Number.js" + '');
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/fround.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/fround.js";
    var $isFinite = isFinite;
    var $isNaN = isNaN;
    var $__0 = Math,
        LN2 = $__0.LN2,
        abs = $__0.abs,
        floor = $__0.floor,
        log = $__0.log,
        min = $__0.min,
        pow = $__0.pow;
    function packIEEE754(v, ebits, fbits) {
      var bias = (1 << (ebits - 1)) - 1,
          s,
          e,
          f,
          ln,
          i,
          bits,
          str,
          bytes;
      function roundToEven(n) {
        var w = floor(n),
            f = n - w;
        if (f < 0.5)
          return w;
        if (f > 0.5)
          return w + 1;
        return w % 2 ? w + 1 : w;
      }
      if (v !== v) {
        e = (1 << ebits) - 1;
        f = pow(2, fbits - 1);
        s = 0;
      } else if (v === Infinity || v === -Infinity) {
        e = (1 << ebits) - 1;
        f = 0;
        s = (v < 0) ? 1 : 0;
      } else if (v === 0) {
        e = 0;
        f = 0;
        s = (1 / v === -Infinity) ? 1 : 0;
      } else {
        s = v < 0;
        v = abs(v);
        if (v >= pow(2, 1 - bias)) {
          e = min(floor(log(v) / LN2), 1023);
          f = roundToEven(v / pow(2, e) * pow(2, fbits));
          if (f / pow(2, fbits) >= 2) {
            e = e + 1;
            f = 1;
          }
          if (e > bias) {
            e = (1 << ebits) - 1;
            f = 0;
          } else {
            e = e + bias;
            f = f - pow(2, fbits);
          }
        } else {
          e = 0;
          f = roundToEven(v / pow(2, 1 - bias - fbits));
        }
      }
      bits = [];
      for (i = fbits; i; i -= 1) {
        bits.push(f % 2 ? 1 : 0);
        f = floor(f / 2);
      }
      for (i = ebits; i; i -= 1) {
        bits.push(e % 2 ? 1 : 0);
        e = floor(e / 2);
      }
      bits.push(s ? 1 : 0);
      bits.reverse();
      str = bits.join('');
      bytes = [];
      while (str.length) {
        bytes.push(parseInt(str.substring(0, 8), 2));
        str = str.substring(8);
      }
      return bytes;
    }
    function unpackIEEE754(bytes, ebits, fbits) {
      var bits = [],
          i,
          j,
          b,
          str,
          bias,
          s,
          e,
          f;
      for (i = bytes.length; i; i -= 1) {
        b = bytes[i - 1];
        for (j = 8; j; j -= 1) {
          bits.push(b % 2 ? 1 : 0);
          b = b >> 1;
        }
      }
      bits.reverse();
      str = bits.join('');
      bias = (1 << (ebits - 1)) - 1;
      s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
      e = parseInt(str.substring(1, 1 + ebits), 2);
      f = parseInt(str.substring(1 + ebits), 2);
      if (e === (1 << ebits) - 1) {
        return f !== 0 ? NaN : s * Infinity;
      } else if (e > 0) {
        return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
      } else if (f !== 0) {
        return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
      } else {
        return s < 0 ? -0 : 0;
      }
    }
    function unpackF32(b) {
      return unpackIEEE754(b, 8, 23);
    }
    function packF32(v) {
      return packIEEE754(v, 8, 23);
    }
    function fround(x) {
      if (x === 0 || !$isFinite(x) || $isNaN(x)) {
        return x;
      }
      return unpackF32(packF32(Number(x)));
    }
    return {get fround() {
        return fround;
      }};
  });
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/Math.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/Math.js";
    var jsFround = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./fround.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Math.js")).fround;
    var $__3 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/Math.js")),
        maybeAddFunctions = $__3.maybeAddFunctions,
        registerPolyfill = $__3.registerPolyfill,
        toUint32 = $__3.toUint32;
    var $isFinite = isFinite;
    var $isNaN = isNaN;
    var $__0 = Math,
        abs = $__0.abs,
        ceil = $__0.ceil,
        exp = $__0.exp,
        floor = $__0.floor,
        log = $__0.log,
        pow = $__0.pow,
        sqrt = $__0.sqrt;
    function clz32(x) {
      x = toUint32(+x);
      if (x == 0)
        return 32;
      var result = 0;
      if ((x & 0xFFFF0000) === 0) {
        x <<= 16;
        result += 16;
      }
      ;
      if ((x & 0xFF000000) === 0) {
        x <<= 8;
        result += 8;
      }
      ;
      if ((x & 0xF0000000) === 0) {
        x <<= 4;
        result += 4;
      }
      ;
      if ((x & 0xC0000000) === 0) {
        x <<= 2;
        result += 2;
      }
      ;
      if ((x & 0x80000000) === 0) {
        x <<= 1;
        result += 1;
      }
      ;
      return result;
    }
    function imul(x, y) {
      x = toUint32(+x);
      y = toUint32(+y);
      var xh = (x >>> 16) & 0xffff;
      var xl = x & 0xffff;
      var yh = (y >>> 16) & 0xffff;
      var yl = y & 0xffff;
      return xl * yl + (((xh * yl + xl * yh) << 16) >>> 0) | 0;
    }
    function sign(x) {
      x = +x;
      if (x > 0)
        return 1;
      if (x < 0)
        return -1;
      return x;
    }
    function log10(x) {
      return log(x) * 0.434294481903251828;
    }
    function log2(x) {
      return log(x) * 1.442695040888963407;
    }
    function log1p(x) {
      x = +x;
      if (x < -1 || $isNaN(x)) {
        return NaN;
      }
      if (x === 0 || x === Infinity) {
        return x;
      }
      if (x === -1) {
        return -Infinity;
      }
      var result = 0;
      var n = 50;
      if (x < 0 || x > 1) {
        return log(1 + x);
      }
      for (var i = 1; i < n; i++) {
        if ((i % 2) === 0) {
          result -= pow(x, i) / i;
        } else {
          result += pow(x, i) / i;
        }
      }
      return result;
    }
    function expm1(x) {
      x = +x;
      if (x === -Infinity) {
        return -1;
      }
      if (!$isFinite(x) || x === 0) {
        return x;
      }
      return exp(x) - 1;
    }
    function cosh(x) {
      x = +x;
      if (x === 0) {
        return 1;
      }
      if ($isNaN(x)) {
        return NaN;
      }
      if (!$isFinite(x)) {
        return Infinity;
      }
      if (x < 0) {
        x = -x;
      }
      if (x > 21) {
        return exp(x) / 2;
      }
      return (exp(x) + exp(-x)) / 2;
    }
    function sinh(x) {
      x = +x;
      if (!$isFinite(x) || x === 0) {
        return x;
      }
      return (exp(x) - exp(-x)) / 2;
    }
    function tanh(x) {
      x = +x;
      if (x === 0)
        return x;
      if (!$isFinite(x))
        return sign(x);
      var exp1 = exp(x);
      var exp2 = exp(-x);
      return (exp1 - exp2) / (exp1 + exp2);
    }
    function acosh(x) {
      x = +x;
      if (x < 1)
        return NaN;
      if (!$isFinite(x))
        return x;
      return log(x + sqrt(x + 1) * sqrt(x - 1));
    }
    function asinh(x) {
      x = +x;
      if (x === 0 || !$isFinite(x))
        return x;
      if (x > 0)
        return log(x + sqrt(x * x + 1));
      return -log(-x + sqrt(x * x + 1));
    }
    function atanh(x) {
      x = +x;
      if (x === -1) {
        return -Infinity;
      }
      if (x === 1) {
        return Infinity;
      }
      if (x === 0) {
        return x;
      }
      if ($isNaN(x) || x < -1 || x > 1) {
        return NaN;
      }
      return 0.5 * log((1 + x) / (1 - x));
    }
    function hypot(x, y) {
      var length = arguments.length;
      var args = new Array(length);
      var max = 0;
      for (var i = 0; i < length; i++) {
        var n = arguments[i];
        n = +n;
        if (n === Infinity || n === -Infinity)
          return Infinity;
        n = abs(n);
        if (n > max)
          max = n;
        args[i] = n;
      }
      if (max === 0)
        max = 1;
      var sum = 0;
      var compensation = 0;
      for (var i = 0; i < length; i++) {
        var n = args[i] / max;
        var summand = n * n - compensation;
        var preliminary = sum + summand;
        compensation = (preliminary - sum) - summand;
        sum = preliminary;
      }
      return sqrt(sum) * max;
    }
    function trunc(x) {
      x = +x;
      if (x > 0)
        return floor(x);
      if (x < 0)
        return ceil(x);
      return x;
    }
    var fround,
        f32;
    if (typeof Float32Array === 'function') {
      f32 = new Float32Array(1);
      fround = function(x) {
        f32[0] = Number(x);
        return f32[0];
      };
    } else {
      fround = jsFround;
    }
    function cbrt(x) {
      x = +x;
      if (x === 0)
        return x;
      var negate = x < 0;
      if (negate)
        x = -x;
      var result = pow(x, 1 / 3);
      return negate ? -result : result;
    }
    function polyfillMath(global) {
      var Math = global.Math;
      maybeAddFunctions(Math, ['acosh', acosh, 'asinh', asinh, 'atanh', atanh, 'cbrt', cbrt, 'clz32', clz32, 'cosh', cosh, 'expm1', expm1, 'fround', fround, 'hypot', hypot, 'imul', imul, 'log10', log10, 'log1p', log1p, 'log2', log2, 'sign', sign, 'sinh', sinh, 'tanh', tanh, 'trunc', trunc]);
    }
    registerPolyfill(polyfillMath);
    return {
      get clz32() {
        return clz32;
      },
      get imul() {
        return imul;
      },
      get sign() {
        return sign;
      },
      get log10() {
        return log10;
      },
      get log2() {
        return log2;
      },
      get log1p() {
        return log1p;
      },
      get expm1() {
        return expm1;
      },
      get cosh() {
        return cosh;
      },
      get sinh() {
        return sinh;
      },
      get tanh() {
        return tanh;
      },
      get acosh() {
        return acosh;
      },
      get asinh() {
        return asinh;
      },
      get atanh() {
        return atanh;
      },
      get hypot() {
        return hypot;
      },
      get trunc() {
        return trunc;
      },
      get fround() {
        return fround;
      },
      get cbrt() {
        return cbrt;
      },
      get polyfillMath() {
        return polyfillMath;
      }
    };
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/polyfills/Math.js" + '');
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/WeakMap.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/WeakMap.js";
    var $__5 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../private.js", "traceur-runtime@0.0.108/src/runtime/polyfills/WeakMap.js")),
        createPrivateSymbol = $__5.createPrivateSymbol,
        deletePrivate = $__5.deletePrivate,
        getPrivate = $__5.getPrivate,
        hasPrivate = $__5.hasPrivate,
        setPrivate = $__5.setPrivate;
    var $__6 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../frozen-data.js", "traceur-runtime@0.0.108/src/runtime/polyfills/WeakMap.js")),
        deleteFrozen = $__6.deleteFrozen,
        getFrozen = $__6.getFrozen,
        hasFrozen = $__6.hasFrozen,
        setFrozen = $__6.setFrozen;
    var $__7 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/WeakMap.js")),
        isObject = $__7.isObject,
        registerPolyfill = $__7.registerPolyfill;
    var hasNativeSymbol = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../has-native-symbols.js", "traceur-runtime@0.0.108/src/runtime/polyfills/WeakMap.js")).default;
    var $__2 = Object,
        defineProperty = $__2.defineProperty,
        getOwnPropertyDescriptor = $__2.getOwnPropertyDescriptor,
        isExtensible = $__2.isExtensible;
    var $TypeError = TypeError;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var sentinel = {};
    var WeakMap = function() {
      function WeakMap() {
        this.name_ = createPrivateSymbol();
        this.frozenData_ = [];
      }
      return ($traceurRuntime.createClass)(WeakMap, {
        set: function(key, value) {
          if (!isObject(key))
            throw new $TypeError('key must be an object');
          if (!isExtensible(key)) {
            setFrozen(this.frozenData_, key, value);
          } else {
            setPrivate(key, this.name_, value);
          }
          return this;
        },
        get: function(key) {
          if (!isObject(key))
            return undefined;
          if (!isExtensible(key)) {
            return getFrozen(this.frozenData_, key);
          }
          return getPrivate(key, this.name_);
        },
        delete: function(key) {
          if (!isObject(key))
            return false;
          if (!isExtensible(key)) {
            return deleteFrozen(this.frozenData_, key);
          }
          return deletePrivate(key, this.name_);
        },
        has: function(key) {
          if (!isObject(key))
            return false;
          if (!isExtensible(key)) {
            return hasFrozen(this.frozenData_, key);
          }
          return hasPrivate(key, this.name_);
        }
      }, {});
    }();
    function needsPolyfill(global) {
      var $__4 = global,
          WeakMap = $__4.WeakMap,
          Symbol = $__4.Symbol;
      if (!WeakMap || !hasNativeSymbol()) {
        return true;
      }
      try {
        var o = {};
        var wm = new WeakMap([[o, false]]);
        return wm.get(o);
      } catch (e) {
        return false;
      }
    }
    function polyfillWeakMap(global) {
      if (needsPolyfill(global)) {
        global.WeakMap = WeakMap;
      }
    }
    registerPolyfill(polyfillWeakMap);
    return {
      get WeakMap() {
        return WeakMap;
      },
      get polyfillWeakMap() {
        return polyfillWeakMap;
      }
    };
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/polyfills/WeakMap.js" + '');
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/WeakSet.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/WeakSet.js";
    var $__5 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../private.js", "traceur-runtime@0.0.108/src/runtime/polyfills/WeakSet.js")),
        createPrivateSymbol = $__5.createPrivateSymbol,
        deletePrivate = $__5.deletePrivate,
        getPrivate = $__5.getPrivate,
        hasPrivate = $__5.hasPrivate,
        setPrivate = $__5.setPrivate;
    var $__6 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../frozen-data.js", "traceur-runtime@0.0.108/src/runtime/polyfills/WeakSet.js")),
        deleteFrozen = $__6.deleteFrozen,
        getFrozen = $__6.getFrozen,
        setFrozen = $__6.setFrozen;
    var $__7 = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/WeakSet.js")),
        isObject = $__7.isObject,
        registerPolyfill = $__7.registerPolyfill;
    var hasNativeSymbol = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../has-native-symbols.js", "traceur-runtime@0.0.108/src/runtime/polyfills/WeakSet.js")).default;
    var $__2 = Object,
        defineProperty = $__2.defineProperty,
        isExtensible = $__2.isExtensible;
    var $TypeError = TypeError;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var WeakSet = function() {
      function WeakSet() {
        this.name_ = createPrivateSymbol();
        this.frozenData_ = [];
      }
      return ($traceurRuntime.createClass)(WeakSet, {
        add: function(value) {
          if (!isObject(value))
            throw new $TypeError('value must be an object');
          if (!isExtensible(value)) {
            setFrozen(this.frozenData_, value, value);
          } else {
            setPrivate(value, this.name_, true);
          }
          return this;
        },
        delete: function(value) {
          if (!isObject(value))
            return false;
          if (!isExtensible(value)) {
            return deleteFrozen(this.frozenData_, value);
          }
          return deletePrivate(value, this.name_);
        },
        has: function(value) {
          if (!isObject(value))
            return false;
          if (!isExtensible(value)) {
            return getFrozen(this.frozenData_, value) === value;
          }
          return hasPrivate(value, this.name_);
        }
      }, {});
    }();
    function needsPolyfill(global) {
      var $__4 = global,
          WeakSet = $__4.WeakSet,
          Symbol = $__4.Symbol;
      if (!WeakSet || !hasNativeSymbol()) {
        return true;
      }
      try {
        var o = {};
        var wm = new WeakSet([[o]]);
        return !wm.has(o);
      } catch (e) {
        return false;
      }
    }
    function polyfillWeakSet(global) {
      if (needsPolyfill(global)) {
        global.WeakSet = WeakSet;
      }
    }
    registerPolyfill(polyfillWeakSet);
    return {
      get WeakSet() {
        return WeakSet;
      },
      get polyfillWeakSet() {
        return polyfillWeakSet;
      }
    };
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/polyfills/WeakSet.js" + '');
  $traceurRuntime.registerModule("traceur-runtime@0.0.108/src/runtime/polyfills/polyfills.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.108/src/runtime/polyfills/polyfills.js";
    var polyfillAll = $traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils.js", "traceur-runtime@0.0.108/src/runtime/polyfills/polyfills.js")).polyfillAll;
    polyfillAll(Reflect.global);
    var setupGlobals = $traceurRuntime.setupGlobals;
    $traceurRuntime.setupGlobals = function(global) {
      setupGlobals(global);
      polyfillAll(global);
    };
    return {};
  });
  $traceurRuntime.getModule("traceur-runtime@0.0.108/src/runtime/polyfills/polyfills.js" + '');

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //
  // Node polyfills (http://dom.spec.whatwg.org)
  //

  if (!Node.prototype.append) {
    Node.prototype.append = function(child) {
      this.appendChild(child);
    }
  }

  //
  // KeyboardEvent polyfills
  //

  // @info
  //   KeyboardEvent.prototype.key property polyfill
  (function() {
    if (window.KeyboardEvent.prototype.hasOwnProperty("key") === false) {
      var invalidIdents = {
        // On Windows and Linux event.keyIdentifier returns invalid values for some idents
        // https://bugs.webkit.org/show_bug.cgi?id=19906
        "U+00C0": "U+0060", // À -> `
        "U+00BD": "U+002D", // ½ -> -
        "U+00BB": "U+003D", // » -> =
        "U+00DB": "U+005B", // Û -> [
        "U+00DD": "U+005D", // Ý -> ]
        "U+00DC": "U+005C", // Ü -> \
        "U+00BA": "U+003B", // º -> ;
        "U+00DE": "U+0027", // Þ -> '
        "U+00BC": "U+002C", // ¼ -> ,
        "U+00BE": "U+002E", // ¾ -> .
        "U+00BF": "U+002F", // ¿ -> /
        // Current DOM spec uses different arrow keys IDs
        "Win": "Meta",
        "Left": "ArrowLeft",
        "Right": "ArrowRight",
        "Up": "ArrowUp",
        "Down": "ArrowDown"
      };

      Object.defineProperty(KeyboardEvent.prototype, 'key', {
        get() {
          var ident = this.keyIdentifier;

          for (var invalidIdent in invalidIdents) {
            if (ident === invalidIdent) {
              var validIdent = invalidIdents[invalidIdent];
              ident = validIdent;
            }
          }

          var key = null;

          if (ident[0] === "U" && ident[1] === "+") {
            var code = parseInt(ident.substring(2), 16);

            if (code === 27) {
              key = "Escape";
            }
            else if (code === 8) {
              key = "Backspace";
            }
            else {
              key = String.fromCharCode(code);

              if (key === "\t") {
                key = "Tab";
              }
              else if (key === " ") {
                key = "Space";
              }
              else if (this.shiftKey === false) {
                key = key.toLowerCase();
              }
            }
          }
          else {
            key = ident;
          }

          return key;
        }
      });
    }
  })();

  //
  // Make array-like DOM objects iterable
  //

  (function() {
    [NodeList, NamedNodeMap, HTMLCollection].forEach( function(pseudoArray) {
      if (!pseudoArray.prototype[Symbol.iterator]) {
        Object.defineProperty(pseudoArray.prototype, Symbol.iterator, {
          configurable: true,
          enumerable: false,
          writable: true,
          value: Array.prototype[Symbol.iterator]
        });
      }
    });
  })();

  window.addEventListener("load", function() {
    $traceurRuntime.getModule("./api/boxy-svg");
  });
}
$traceurRuntime.registerModule("api/boxy-svg",[],function(){"use strict";$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./elements/bx-editor","api/boxy-svg")),
$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./elements/bx-hamburgermenu","api/boxy-svg")),
$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./elements/bx-preferences","api/boxy-svg")),
$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./elements/bx-about","api/boxy-svg")),
$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./elements/bx-messagebox","api/boxy-svg"));
var e=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./utils","api/boxy-svg")),t=e.registerElement,n=e.toDashCase,i=e.sleep,r=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./classes/shortcut","api/boxy-svg"))["default"],s=Number.parseInt,o='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"></svg>',a=["0.0.0.0","foksa.name","boxy-svg.com","www.sitepoint.com"],u='\n  <style>@import url("'+BX_BASE_URL+'/stylesheets/scrollbars.css");</style>\n  <style>@import url("'+BX_BASE_URL+'/stylesheets/boxy-svg.css");</style>\n\n  <main>\n    <bx-editor id="editor"></bx-editor>\n\n    <bx-hamburgermenu id="main-menu" hidden>\n      <bx-menuitem commandid="undo" label="Undo" shortcut="Control+Z"></bx-menuitem>\n      <bx-menuitem commandid="redo" label="Redo" shortcut="Control+Shift+Z"></bx-menuitem>\n      <hr/>\n      <bx-menuitem commandid="cut" label="Cut" shortcut="Control+X"></bx-menuitem>\n      <bx-menuitem commandid="copy" label="Copy" shortcut="Control+C"></bx-menuitem>\n      <bx-menuitem commandid="paste" label="Paste" shortcut="Control+V"></bx-menuitem>\n      <bx-menuitem commandid="duplicate" label="Duplicate" shortcut="Control+D"></bx-menuitem>\n      <bx-menuitem commandid="delete" label="Delete" shortcut="Backspace"></bx-menuitem>\n      <hr/>\n      <bx-menuitem commandid="selectAll" label="Select All" shortcut="Control+A"></bx-menuitem>\n      <bx-menuitem commandid="deselectAll" label="Deselect All" shortcut="Control+Shift+A"></bx-menuitem>\n      <hr/>\n      <bx-menuitem label="View">\n        <bx-menu>\n          <bx-menuitem commandid="zoomIn" label="Zoom In" shortcut="="></bx-menuitem>\n          <bx-menuitem commandid="zoomOut"label="Zoom Out" shortcut="-"></bx-menuitem>\n          <bx-menuitem commandid="resetZoom" label="Reset Zoom" shortcut="1"></bx-menuitem>\n          <hr/>\n          <bx-menuitem commandid="zoomToViewBox" label="Zoom to View Box" shortcut="2"></bx-menuitem>\n          <bx-menuitem commandid="zoomToViewBoxWidth" label="Zoom to View Box Width" shortcut="3"></bx-menuitem>\n          <bx-menuitem commandid="zoomToViewBoxHeight" label="Zoom to View Box Height" shortcut="4"></bx-menuitem>\n          <hr/>\n          <bx-menuitem commandid="zoomToFitAll"label="Zoom to Fit All" shortcut="5"></bx-menuitem>\n        </bx-menu>\n      </bx-menuitem>\n      <bx-menuitem label="Arrange">\n        <bx-menu>\n          <bx-menuitem commandid="group" label="Group" shortcut="Control+G"></bx-menuitem>\n          <bx-menuitem commandid="ungroup" label="Ungroup" shortcut="Control+Shift+G"></bx-menuitem>\n          <hr/>\n          <bx-menuitem commandid="raise" label="Raise" shortcut="]"></bx-menuitem>\n          <bx-menuitem commandid="lower" label="Lower" shortcut="["></bx-menuitem>\n          <bx-menuitem commandid="raiseToFront" label="Raise to Front" shortcut="Control+]"></bx-menuitem>\n          <bx-menuitem commandid="lowerToBack" label="Lower to Back" shortcut="Control+["></bx-menuitem>\n          <hr/>\n          <bx-menuitem commandid="rotateClockwise" label="Rotate +90°" shortcut="Control+Shift+ArrowRight"></bx-menuitem>\n          <bx-menuitem commandid="rotateCounterclockwise" label="Rotate -90°" shortcut="Control+Shift+ArrowLeft"></bx-menuitem>\n          <hr/>\n          <bx-menuitem commandid="flipX" label="Flip X" shortcut="Control+Shift+ArrowUp"></bx-menuitem>\n          <bx-menuitem commandid="flipY" label="Flip Y" shortcut="Control+Shift+ArrowDown"></bx-menuitem>\n          <hr/>\n          <bx-menuitem commandid="moveOneUnitLeft" label="Move 1 Unit Left"></bx-menuitem>\n          <bx-menuitem commandid="moveOneUnitRight" label="Move 1 Unit Right"></bx-menuitem>\n          <bx-menuitem commandid="moveOneUnitUp" label="Move 1 Unit Up"></bx-menuitem>\n          <bx-menuitem commandid="moveOneUnitDown" label="Move 1 Unit Down"></bx-menuitem>\n          <hr/>\n          <bx-menuitem commandid="moveTenUnitsLeft" label="Move 10 Units Left"></bx-menuitem>\n          <bx-menuitem commandid="moveTenUnitsRight" label="Move 10 Units Right"></bx-menuitem>\n          <bx-menuitem commandid="moveTenUnitsUp" label="Move 10 Units Up"></bx-menuitem>\n          <bx-menuitem commandid="moveTenUnitsDown" label="Move 10 Units Down"></bx-menuitem>\n        </bx-menu>\n      </bx-menuitem>\n      <bx-menuitem label="Path">\n        <bx-menu>\n          <bx-menuitem commandid="convertToPath" label="Convert to Path"></bx-menuitem>\n          <bx-menuitem commandid="reversePath" label="Reverse Path"></bx-menuitem>\n          <hr/>\n          <bx-menuitem commandid="unite" label="Unite"></bx-menuitem>\n          <bx-menuitem commandid="subtract" label="Subtract"></bx-menuitem>\n          <bx-menuitem commandid="intersect" label="Intersect"></bx-menuitem>\n          <bx-menuitem commandid="exclude" label="Exclude"></bx-menuitem>\n          <hr/>\n          <bx-menuitem commandid="combine" label="Combine"></bx-menuitem>\n          <bx-menuitem commandid="breakApart" label="Break Apart"></bx-menuitem>\n        </bx-menu>\n      </bx-menuitem>\n      <bx-menuitem label="Mask">\n        <bx-menu>\n          <bx-menuitem commandid="clip" label="Clip"></bx-menuitem>\n          <bx-menuitem commandid="unclip"label="Unclip"></bx-menuitem>\n          <hr/>\n          <bx-menuitem commandid="mask" label="Mask"></bx-menuitem>\n          <bx-menuitem commandid="unmask" label="Unmask"></bx-menuitem>\n        </bx-menu>\n      </bx-menuitem>\n      <bx-menuitem label="Tools">\n        <bx-menu id="tools-menu">\n          <bx-menuitem commandid="previousTool" label="Previous Tool" shortcut="Space"></bx-menuitem>\n          <hr/>\n          <bx-menuitem commandid="transformTool" label="Transform Tool" shortcut="Alt+1"></bx-menuitem>\n          <bx-menuitem commandid="editTool" label="Edit Tool" shortcut="Alt+2"></bx-menuitem>\n          <bx-menuitem commandid="quadBezierTool" label="Quad Bezier Tool" shortcut="Alt+3"></bx-menuitem>\n          <bx-menuitem commandid="cubicBezierTool" label="Cubic Bezier Tool" shortcut="Alt+4"></bx-menuitem>\n          <bx-menuitem commandid="freehandTool" label="Freehand Tool" shortcut="Alt+5"></bx-menuitem>\n          <bx-menuitem commandid="textTool" label="Text Tool" shortcut="Alt+6"></bx-menuitem>\n          <bx-menuitem commandid="rectangleTool" label="Rectangle Tool" shortcut="Alt+7"></bx-menuitem>\n          <bx-menuitem commandid="ellipseTool" label="Ellipse Tool" shortcut="Alt+8"></bx-menuitem>\n          <bx-menuitem commandid="starTool" label="Star Tool" shortcut="Alt+9"></bx-menuitem>\n          <bx-menuitem commandid="ringTool" label="Ring Tool" shortcut="Alt+0"></bx-menuitem>\n        </bx-menu>\n      </bx-menuitem>\n      <bx-menuitem label="Panels">\n        <bx-menu id="panels-menu">\n          <bx-menuitem commandid="fillPanel" label="Fill Panel" shortcut="F"></bx-menuitem>\n          <bx-menuitem commandid="strokePanel" label="Stroke Panel" shortcut="S"></bx-menuitem>\n          <bx-menuitem commandid="compositingPanel" label="Compositing Panel" shortcut="C"></bx-menuitem>\n          <bx-menuitem commandid="viewPanel" label="View Panel" shortcut="V"></bx-menuitem>\n          <bx-menuitem commandid="arrangementPanel" label="Arrangement Panel" shortcut="A"></bx-menuitem>\n          <bx-menuitem commandid="typographyPanel" label="Typography Panel"  shortcut="T"></bx-menuitem>\n          <bx-menuitem commandid="defsPanel" label="Defs Panel" shortcut="D"></bx-menuitem>\n          <bx-menuitem commandid="maskPanel" label="Mask Panel" shortcut="M"></bx-menuitem>\n          <bx-menuitem commandid="geometryPanel" label="Geometry Panel" shortcut="G"></bx-menuitem>\n          <bx-menuitem commandid="pathPanel" label="Path Panel" shortcut="P"></bx-menuitem>\n          <bx-menuitem commandid="exportPanel" label="Export Panel" shortcut="E"></bx-menuitem>\n        </bx-menu>\n      </bx-menuitem>\n      <hr/>\n      <bx-menuitem commandid="inspector" label="Inspect" shortcut="I"></bx-menuitem>\n      <bx-menuitem commandid="reload" label="Reload"></bx-menuitem>\n      <hr/>\n      <bx-menuitem commandid="preferences" label="Preferences…"></bx-menuitem>\n      <bx-menuitem commandid="about" label="About"></bx-menuitem>\n    </bx-hamburgermenu>\n\n    <bx-preferences id="preferences" hidden></bx-preferences>\n    <bx-about id="about" hidden></bx-about>\n    <dialog id="message-box" is="bx-messagebox"></dialog>\n  </main>\n',l=function(e){
function t(){$traceurRuntime.superConstructor(t).apply(this,arguments)}return $traceurRuntime.createClass(t,{
createdCallback:function(){var e=this;if(this._commands={about:{enabled:function(){
return!0},exec:function(){return e._showAbout()}},preferences:{enabled:function(){
return!0},exec:function(){return e._showPreferences()}},reload:{exec:function(){return e._onHrefAttributeChange();
}}},null!==document.querySelector('script[src="http://boxy-svg.com/api/boxy-svg.js"]')){
if(this._restrictedFeatures=["inspector"],"file:"!==location.protocol&&a.includes(location.hostname)===!1)return void console.info("Boxy SVG unknown host: "+location.hostname);
}else this._restrictedFeatures=[];this._shadowRoot=this.createShadowRoot({mode:"closed"
}),this._shadowRoot.innerHTML=u;var t=!0,n=!1,i=void 0;try{for(var r=void 0,s=this._shadowRoot.querySelectorAll("[id]")[Symbol.iterator]();!(t=(r=s.next()).done);t=!0){
var l=r.value;this["#"+l.id]=l}}catch(c){n=!0,i=c}finally{try{t||null==s["return"]||s["return"]();
}finally{if(n)throw i}}var h=!0,m=!1,d=void 0;try{for(var b=void 0,f=this.attributes[Symbol.iterator]();!(h=(b=f.next()).done);h=!0){
var g=b.value;this.attributeChangedCallback(g.name)}}catch(v){m=!0,d=v}finally{try{
h||null==f["return"]||f["return"]()}finally{if(m)throw d}}this.addEventListener("keydown",function(t){
return e._onKeyDown(t)}),this["#main-menu"].menuWillShow=function(t){return e._menuWillShow(t);
},this["#main-menu"].menuItemWillTrigger=function(t){return e._menuItemWillTrigger(t);
},this["#main-menu"].addEventListener("menuitemtrigger",function(t){return e._onMenuItemTrigger(t);
}),this["#main-menu"].addEventListener("blur",function(){return e["#editor"].focus();
}),this["#editor"].addEventListener("shortcutpress",function(t){return e["#main-menu"].triggerItemForShortcut(t.detail);
}),this["#editor"].promiseReady().then(function(){return e["#main-menu"].hidden=!1;
}),this["#about"].addEventListener("backbutonclick",function(){return e._hideAbout();
}),this["#about"].addEventListener("overlayclick",function(){return e._hideAbout();
}),this["#preferences"].addEventListener("backbutonclick",function(){return e._hidePreferences();
}),this._removeRestrictedMainMenuItems(),this._updateMainMenuWithUserShortcuts(),
this._importFonts(),this._validateToolsMenu(),this._validatePanelsMenu(),this.href||this["#editor"].setArtwork(o);
},attributeChangedCallback:function(e){"href"===e&&this._onHrefAttributeChange()},
get commands(){return this._commands},get restrictedFeatures(){return this._restrictedFeatures;
},get assignedShortcuts(){var e=this["#main-menu"].querySelectorAll("bx-menuitem[shortcut], bx-menuitem[usershortcut]"),t=[],n=!0,i=!1,r=void 0;
try{for(var s=void 0,o=e[Symbol.iterator]();!(n=(s=o.next()).done);n=!0){var a=s.value;
a.hasAttribute("usershortcut")&&t.push(a.getAttribute("usershortcut")),a.hasAttribute("shortcut")&&t.push(a.getAttribute("shortcut"));
}}catch(u){i=!0,r=u}finally{try{n||null==o["return"]||o["return"]()}finally{if(i)throw r;
}}return t},get href(){return this.hasAttribute("href")?this.getAttribute("href"):"";
},set href(e){e?this.setAttribute("href",e):this.removeAttribute("href")},get mainMenu(){
return this["#main-menu"]},_menuWillShow:function(e){var t=this;return new Promise(function(n){
var i=!0,r=!1,s=void 0;try{for(var o=void 0,a=e.items[Symbol.iterator]();!(i=(o=a.next()).done);i=!0){
var u=o.value;"bx-menuitem"===u.localName&&t._validateMenuItem(u)}}catch(l){r=!0,
s=l}finally{try{i||null==a["return"]||a["return"]()}finally{if(r)throw s}}"tools-menu"===e.id?t._validateToolsMenu():"panels-menu"===e.id&&t._validatePanelsMenu(),
n()})},_menuItemWillTrigger:function(e){return this._validateMenuItem(e)},_validateToolsMenu:function(){
var e=!0,t=!1,i=void 0;try{for(var r=void 0,s=this["#tools-menu"].children[Symbol.iterator]();!(e=(r=s.next()).done);e=!0){
var o=r.value;"bx-menuitem"===o.localName&&(o.state=o.commandID===this["#editor"].currentToolID?"toggled":null,
o.hidden=this.restrictedFeatures.includes(n(o.commandID))&&"previousTool"!==o.commandID);
}}catch(a){t=!0,i=a}finally{try{e||null==s["return"]||s["return"]()}finally{if(t)throw i;
}}},_validatePanelsMenu:function(){var e=!0,t=!1,i=void 0;try{for(var r=void 0,s=this["#panels-menu"].children[Symbol.iterator]();!(e=(r=s.next()).done);e=!0){
var o=r.value;"bx-menuitem"===o.localName&&(o.state=o.commandID===this["#editor"].currentSecondaryPanelID?"toggled":null,
o.hidden=this.restrictedFeatures.includes(n(o.commandID)))}}catch(a){t=!0,i=a}finally{
try{e||null==s["return"]||s["return"]()}finally{if(t)throw i}}},_validateMenuItem:function(e){
var t=this;return new Promise(function(n){var i,r;return $traceurRuntime.asyncWrap(function(s){
for(;;)switch(s.state){case 0:e.commandID?(i=e.commandID,r=t._commands[i],r?(e.disabled=r.enabled?!r.enabled():!1,
n()):t["#editor"].postMessage("validateCommand",i,function(t){e.disabled=!t,n()})):n(),
s.state=-2;break;default:return s.end()}},this)})},getConfig:function(e){var t=localStorage.getItem(e);
return null===t?null:JSON.parse(t)},setConfig:function(e,t){null===t?localStorage.removeItem(e):localStorage.setItem(e,JSON.stringify(t)),
this._onConfigChange(e,t)},getClipboardData:function(){var e=sessionStorage.getItem("boxy-svg:clipboardData");
return e?JSON.parse(e):{}},setClipboardData:function(e){sessionStorage.setItem("boxy-svg:clipboardData",JSON.stringify(e));
},getArtwork:function(){void 0!==arguments[0]?arguments[0]:"xml";return this["#editor"].getArtwork();
},getShortcutsEditorModel:function(){var e=[],t=!0,n=!1,i=void 0;try{for(var r=void 0,s=this._shadowRoot.querySelectorAll("bx-menu, bx-hamburgermenu")[Symbol.iterator]();!(t=(r=s.next()).done);t=!0){
var o=r.value;if(o.hidden===!1){for(var a=[],u=o;"bx-hamburgermenu"!==u.localName;u=u.parentElement)u.label&&a.unshift(u.label);
var l=!0,c=!1,h=void 0;try{for(var m=void 0,d=o.children[Symbol.iterator]();!(l=(m=d.next()).done);l=!0){
var b=m.value;b.commandID&&b.hidden===!1&&e.push({id:b.commandID,label:$traceurRuntime.spread(a,[b.label]).join(" ‣ "),
shortcut:b.shortcut?b.shortcut.toString():null})}}catch(f){c=!0,h=f}finally{try{l||null==d["return"]||d["return"]();
}finally{if(c)throw h}}}}}catch(g){n=!0,i=g}finally{try{t||null==s["return"]||s["return"]();
}finally{if(n)throw i}}return e},showMessageBox:function(e){var t=this;return new Promise(function(n){
var i;t["#message-box"].open&&t["#message-box"].close(null),t["#main-menu"].disabled=!0,
t["#message-box"].showModal(e),t["#message-box"].addEventListener("close",i=function(){
t["#main-menu"].disabled=!1,t["#message-box"].removeEventListener("close",i),n(s(t["#message-box"].returnValue));
})})},promiseReady:function(){return this["#editor"].promiseReady()},_onHrefAttributeChange:function(){
var e,t;return $traceurRuntime.asyncWrap(function(n){for(;;)switch(n.state){case 0:
n.state=this.href?1:7;break;case 1:return void Promise.resolve(fetch(this.href)).then(n.createCallback(3),n.errback);
case 3:t=n.value,n.state=2;break;case 2:return void Promise.resolve(t.text()).then(n.createCallback(6),n.errback);
case 6:e=n.value,n.state=5;break;case 7:e=o,n.state=5;break;case 5:this["#editor"].setArtwork(e),
n.state=-2;break;default:return n.end()}},this)},_onConfigChange:function(e,t){return $traceurRuntime.asyncWrap(function(n){
for(;;)switch(n.state){case 0:this["#editor"].ready&&this["#editor"].postMessage("event:configchange",{
key:e,value:t}),this["#preferences"].ready&&this["#preferences"].postMessage("event:configchange",{
key:e,value:t}),this["#about"].ready&&this["#about"].postMessage("event:configchange",{
key:e,value:t}),n.state=7;break;case 7:n.state="bx-shortcutseditor:userShortcuts"===e?1:-2;
break;case 1:return void Promise.resolve(this._updateMainMenuWithUserShortcuts()).then(n.createCallback(2),n.errback);
case 2:this["#editor"].postMessage("event:assignedshortcutschange",this.assignedShortcuts),
n.state=-2;break;default:return n.end()}},this)},_onKeyDown:function(e){"Backspace"===e.code&&e.preventDefault();
},_onMenuItemTrigger:function(e){var t=e.detail;this.commands[t.commandID]?this.commands[t.commandID].exec():this["#editor"].postMessage("execCommand",t.commandID);
},_showPreferences:function(){return $traceurRuntime.asyncWrap(function(e){for(;;)switch(e.state){
case 0:this["#preferences"].enabled=!0,e.state=4;break;case 4:return void Promise.resolve(this["#preferences"].promiseReady()).then(e.createCallback(2),e.errback);
case 2:this["#preferences"].hidden=!1,this["#preferences"].focus(),e.state=-2;break;
default:return e.end()}},this)},_hidePreferences:function(){this["#preferences"].enabled=!1,
this["#preferences"].hidden=!0,this["#editor"].focus()},_showAbout:function(){return $traceurRuntime.asyncWrap(function(e){
for(;;)switch(e.state){case 0:this["#about"].enabled=!0,e.state=4;break;case 4:return void Promise.resolve(this["#about"].promiseReady()).then(e.createCallback(2),e.errback);
case 2:this["#about"].hidden=!1,this["#about"].focus(),e.state=-2;break;default:return e.end();
}},this)},_hideAbout:function(){this["#about"].enabled=!1,this["#about"].hidden=!0,
this["#editor"].focus()},_importFonts:function(){var e;return $traceurRuntime.asyncWrap(function(t){
for(;;)switch(t.state){case 0:e=document.createElement("style"),e.textContent="@import url(https://fonts.googleapis.com/css?family=Roboto:400,700,500);",
document.body.append(e),t.state=4;break;case 4:return void Promise.resolve(i(1e3)).then(t.createCallback(2),t.errback);
case 2:document.fonts.load("13px Roboto"),t.state=-2;break;default:return t.end();
}},this)},_removeRestrictedMainMenuItems:function(){var e=this["#main-menu"].querySelectorAll("bx-menuitem[commandid]"),t=!0,i=!1,r=void 0;
try{for(var s=void 0,o=e[Symbol.iterator]();!(t=(s=o.next()).done);t=!0){var a=s.value;
this.restrictedFeatures.includes(n(a.commandID))&&a.remove()}}catch(u){i=!0,r=u}finally{
try{t||null==o["return"]||o["return"]()}finally{if(i)throw r}}},_updateMainMenuWithUserShortcuts:function(){
var e=this;return new Promise(function(t){var n,i,s,o,a,u,l,c,h,m,d,b;return $traceurRuntime.asyncWrap(function(f){
for(;;)switch(f.state){case 0:h=e.getConfig,m=h.call(e,"bx-shortcutseditor:userShortcuts"),
f.state=5;break;case 5:return void Promise.resolve(m).then(f.createCallback(3),f.errback);
case 3:d=f.value,f.state=2;break;case 2:b=d?d:{},n=b,f.state=7;break;case 7:i=e["#main-menu"].querySelectorAll("bx-menuitem[commandid]"),
s=!0,o=!1,a=void 0;try{for(u=void 0,l=i[Symbol.iterator]();!(s=(u=l.next()).done);s=!0)c=u.value,
n[c.commandID]?c.userShortcut=r.fromString(n[c.commandID]):c.userShortcut=null}catch(g){
o=!0,a=g}finally{try{s||null==l["return"]||l["return"]()}finally{if(o)throw a}}t(),
f.state=-2;break;default:return f.end()}},this)})}},{},e)}(HTMLElement),c=t("boxy-svg",l);
return{get default(){return c}}}),$traceurRuntime.registerModule("api/classes/shortcut",[],function(){
"use strict";var e=["iPhone","iPad"].includes(navigator.platform)||navigator.platform.startsWith("Mac"),t=function(){
function t(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.ctrl=!1,
this.alt=!1,this.meta=!1,this.shift=!1,this.base=null;var n=!0,i=!1,r=void 0;try{
for(var s=void 0,o=e[Symbol.iterator]();!(n=(s=o.next()).done);n=!0){var a=s.value;
"Control"===a?this.ctrl=!0:"Alt"===a?this.alt=!0:"Meta"===a?this.meta=!0:"Shift"===a?this.shift=!0:this.base=a;
}}catch(u){i=!0,r=u}finally{try{n||null==o["return"]||o["return"]()}finally{if(i)throw r;
}}}return $traceurRuntime.createClass(t,{matches:function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];
var n=!1,i=!1,r=!1,s=!1,o=null,a=!0,u=!1,l=void 0;try{for(var c=void 0,h=e[Symbol.iterator]();!(a=(c=h.next()).done);a=!0){
var m=c.value;"Control"===m?n=!0:"Alt"===m?i=!0:"Meta"===m?r=!0:"Shift"===m?s=!0:o=m;
}}catch(d){u=!0,l=d}finally{try{a||null==h["return"]||h["return"]()}finally{if(u)throw l;
}}return n===this.ctrl&&i===this.alt&&r===this.meta&&s===this.shift&&o===this.base;
},includes:function(e){return"Control"===e?this.ctrl:"Alt"===e?this.alt:"Meta"===e?this.meta:"Shift"===e?this.shift:this.base===e;
},compare:function(e){return this.ctrl===e.ctrl&&this.alt===e.alt&&this.meta===e.meta&&this.shift===e.shift&&this.base===e.base;
},isVoid:function(){return this.ctrl===!1&&this.alt===!1&&this.meta===!1&&this.shift===!1&&null===this.base;
},toDisplayString:function(){var t="";if(e){this.meta&&(t+="^"),this.alt&&(t+="⌥"),
this.shift&&(t+="⇧"),this.ctrl&&(t+="⌘");var n={ArrowUp:"↑",ArrowDown:"↓",ArrowLeft:"←",
ArrowRight:"→",Backspace:"⌦"};null!==this.base&&(t+=n[this.base]||this.base)}else{
var i=[];this.ctrl&&i.push("Ctrl"),this.alt&&i.push("Alt"),this.meta&&i.push("Meta"),
this.shift&&i.push("Shift");var r={ArrowUp:"Up",ArrowDown:"Down",ArrowLeft:"Left",
ArrowRight:"Right"};null!==this.base&&i.push(r[this.base]||this.base),t=i.join("+");
}return t},toAccelerator:function(){var e=[];return this.ctrl&&e.push("CmdOrCtrl"),
this.alt&&e.push("Alt"),this.shift&&e.push("Shift"),this.meta,null!==this.base&&("ArrowUp"===this.base?e.push("Up"):"ArrowDown"===this.base?e.push("Down"):"ArrowLeft"===this.base?e.push("Left"):"ArrowRight"===this.base?e.push("Right"):e.push(this.base)),
e.join("+")},toJSON:function(){return this.toString()},toString:function(){var e=[];
return this.ctrl&&e.push("Control"),this.alt&&e.push("Alt"),this.meta&&e.push("Meta"),
this.shift&&e.push("Shift"),null!==this.base&&e.push(this.base),e.join("+")}},{fromEvent:function(n){
var i=new t;i.ctrl=e?n.metaKey:n.ctrlKey,i.alt=n.altKey,i.meta=e?n.ctrlKey:n.metaKey,
i.shift=n.shiftKey;var r=n.key;return" "===r&&(r="Space"),r&&"Control"!==r&&"Alt"!==r&&"Shift"!==r&&"Meta"!==r?1===r.length?i.base=r.toUpperCase():i.base=r:i.base=null,
i},fromAccelerator:function(e){var n=e.split("+"),i=[],r=!0,s=!1,o=void 0;try{for(var a=void 0,u=n[Symbol.iterator]();!(r=(a=u.next()).done);r=!0){
var l=a.value;"CmdOrCtrl"===l||"CommandOrControl"===l?i.push("Control"):"Up"===l?i.push("ArrowUp"):"Down"===l?i.push("ArrowDown"):"Left"===l?i.push("ArrowLeft"):"Right"===l?i.push("ArrowRight"):""!==l&&i.push(l);
}}catch(c){s=!0,o=c}finally{try{r||null==u["return"]||u["return"]()}finally{if(s)throw o;
}}var h=new(Function.prototype.bind.apply(t,$traceurRuntime.spread([null],i)));return h;
},fromString:function(e){return new(Function.prototype.bind.apply(t,$traceurRuntime.spread([null],e.split("+").filter(function(e){
return""!==e}))))}})}();return{get default(){return t}}}),$traceurRuntime.registerModule("api/elements/bx-about",[],function(){
"use strict";var e=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../utils","api/elements/bx-about")).registerElement,t='\n  <style>@import url("'+BX_BASE_URL+'/stylesheets/bx-about.css");</style>\n\n  <div id="container">\n    <header id="header">\n      <div id="back-button">\n        <svg class="icon" id="back-icon" viewBox="0 0 100 100" hidden>\n          <path d="M 99.141 44.381 C 99.141 44.381 23.732 44.381 23.732 44.381 C 23.732 44.381 58.369 12.969 58.369 12.969 C 58.369 12.969 49.57 5.046 49.57 5.046 C 49.57 5.046 0 50 0 50 C 0 50 49.57 94.954 49.57 94.954 C 49.57 94.954 58.307 87.031 58.307 87.031 C 58.307 87.031 23.732 55.619 23.732 55.619 C 23.732 55.619 99.141 55.619 99.141 55.619 C 99.141 55.619 99.141 44.381 99.141 44.381 Z"/>\n        </svg>\n        <h1>About</h1>\n      </div>\n    </header>\n\n    <main id="main">\n      <iframe\n        id="iframe"\n        sandbox="allow-same-origin allow-scripts"\n        name="Boxy SVG"\n        tabindex="-1"\n        seamless>\n      </iframe>\n    </main>\n  </div>\n',n=function(e){
function n(){$traceurRuntime.superConstructor(n).apply(this,arguments)}return $traceurRuntime.createClass(n,{
createdCallback:function(){var e=this;this._messageCounter=0,this._messageRequestCallbacks={},
this._messageResponseCallbacks={},this._iframeLoadedCallbacks=[],this._shadowRoot=this.createShadowRoot({
mode:"closed"}),this._shadowRoot.innerHTML=t;var n=!0,i=!1,r=void 0;try{for(var s=void 0,o=this._shadowRoot.querySelectorAll("[id]")[Symbol.iterator]();!(n=(s=o.next()).done);n=!0){
var a=s.value;this["#"+a.id]=a}}catch(u){i=!0,r=u}finally{try{n||null==o["return"]||o["return"]();
}finally{if(i)throw r}}var l=!0,c=!1,h=void 0;try{for(var m=void 0,d=this.attributes[Symbol.iterator]();!(l=(m=d.next()).done);l=!0){
var b=m.value;this.attributeChangedCallback(b.name)}}catch(f){c=!0,h=f}finally{try{
l||null==d["return"]||d["return"]()}finally{if(c)throw h}}this.addMessageListener("getConfig",function(t,n){
return n(e.owner.getConfig(t))}),this.addMessageListener("setConfig",function(t){
return e.owner.setConfig(t.key,t.value)}),this.addMessageListener("getBackendName",function(e,t){
return t("embedded")}),this.addMessageListener("getAppName",function(e,t){return t("Boxy SVG Component");
}),this.addMessageListener("getAppVersion",function(e,t){return t("2.8.1")}),this.addMessageListener("openExternalURL",function(e){
return window.open(e)}),this["#iframe"].addEventListener("load",function(){return e._onIframeLoaded();
}),this["#back-button"].addEventListener("click",function(t){return e._onBackButtonClick(t);
}),this["#main"].addEventListener("click",function(t){return e._onMainClick(t)})},
attributeChangedCallback:function(e){"enabled"===e&&this._onEnabledAttributeChange();
},get owner(){for(var e=this;e;e=e.parentNode||e.host)if("boxy-svg"===e.localName)return e;
},get ready(){return null===this._iframeLoadedCallbacks},get enabled(){return this.hasAttribute("enabled");
},set enabled(e){e===!0?this.setAttribute("enabled",""):this.removeAttribute("enabled");
},focus:function(){this["#iframe"].focus()},promiseReady:function(){var e=this;return new Promise(function(t){
e._iframeLoadedCallbacks?e._iframeLoadedCallbacks.push(t):t()})},postMessage:function(e){
var t,n,i,r,s=arguments;return $traceurRuntime.asyncWrap(function(o){for(;;)switch(o.state){
case 0:t=void 0!==s[1]?s[1]:null,n=void 0!==s[2]?s[2]:null,o.state=4;break;case 4:
return void Promise.resolve(this.promiseReady()).then(o.createCallback(2),o.errback);
case 2:i=this._messageCounter++,r={channel:"request",id:i,name:e,arg:t},n&&(this._messageResponseCallbacks[r.id]=n),
this["#iframe"].contentWindow.postMessage(r,"*"),o.state=-2;break;default:return o.end();
}},this)},addMessageListener:function(e,t){this._messageRequestCallbacks[e]||(this._messageRequestCallbacks[e]=[]),
this._messageRequestCallbacks[e].push(t)},removeMessageListener:function(e,t){this._messageRequestCallbacks[e]&&(this._messageRequestCallbacks[e]=this._messageRequestCallbacks[e].filter(function(e){
return e!==t}))},_onEnabledAttributeChange:function(){this.enabled?this._onEnabled():this._onDisabled();
},_onEnabled:function(){var e=this;window.addEventListener("message",this._messageListener=function(t){
return e._onMessage(t)}),""===this["#iframe"].src&&(this["#iframe"].src=BX_BASE_URL+"/frontend/about.html");
},_onDisabled:function(){window.removeEventListener("message",this._messageListener);
},_onMessage:function(e){var t=this;if(e.source===this["#iframe"].contentWindow){
var n=e.data,i=n.channel,r=n.id,s=n.name,o=n.arg;"request"===i?this._messageRequestCallbacks[s]&&this._messageRequestCallbacks[s].forEach(function(e){
e(o,function(e){var n={channel:"response",id:r,name:s,arg:e};t["#iframe"].contentWindow.postMessage(n,"*");
})}):"response"===i&&this._messageResponseCallbacks[r]&&(this._messageResponseCallbacks[r](o),
delete this._messageResponseCallbacks[r])}},_onIframeLoaded:function(){if(""!==this["#iframe"].src){
var e=!0,t=!1,n=void 0;try{for(var i=void 0,r=this._iframeLoadedCallbacks[Symbol.iterator]();!(e=(i=r.next()).done);e=!0){
var s=i.value;s()}}catch(o){t=!0,n=o}finally{try{e||null==r["return"]||r["return"]();
}finally{if(t)throw n}}this._iframeLoadedCallbacks=null,this.postMessage("init")}
},_onBackButtonClick:function(e){this.dispatchEvent(new CustomEvent("backbutonclick"));
},_onMainClick:function(e){e.target===this["#main"]&&this.dispatchEvent(new CustomEvent("overlayclick"));
}},{},e)}(HTMLElement),i=e("bx-about",n);return{get default(){return i}}}),$traceurRuntime.registerModule("api/elements/bx-button",[],function(){
"use strict";var e=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../utils","api/elements/bx-button")),t=e.createElement,n=e.registerElement,i=Number.parseInt,r='\n  <style id="skin-stylesheet"></style>\n\n  <main>\n    <svg id="icon" preserveAspectRatio="none" viewBox="0 0 100 100" style="width: 20px; height: 20px;">\n      <use id="icon-use" x="0" y="0" width="100%" height="100%"></use>\n    </svg>\n\n    <label id="label"></label>\n  </main>\n',s=function(e){
function n(){$traceurRuntime.superConstructor(n).apply(this,arguments)}return $traceurRuntime.createClass(n,{
createdCallback:function(){this._shadowRoot=this.createShadowRoot({mode:"closed"}),
this._shadowRoot.innerHTML=r;var e=!0,t=!1,n=void 0;try{for(var i=void 0,s=this._shadowRoot.querySelectorAll("[id]")[Symbol.iterator]();!(e=(i=s.next()).done);e=!0){
var o=i.value;this["#"+o.id]=o}}catch(a){t=!0,n=a}finally{try{e||null==s["return"]||s["return"]();
}finally{if(t)throw n}}var u=!0,l=!1,c=void 0;try{for(var h=void 0,m=this.attributes[Symbol.iterator]();!(u=(h=m.next()).done);u=!0){
var d=h.value;this.attributeChangedCallback(d.name)}}catch(b){l=!0,c=b}finally{try{
u||null==m["return"]||m["return"]()}finally{if(l)throw c}}this._updateSkin()},attributeChangedCallback:function(e){
"label"===e?this._onLabelAttributeChange():"icon"===e?this._onIconAttributeChange():"iconsize"===e?this._onIconSizeAttributeChange():"skin"===e?this._onSkinAttributeChange():"hidden"===e&&this._onHiddenAttributeChange();
},get label(){return this.hasAttribute("label")?this.getAttribute("label"):""},set label(e){
this.setAttribute("label",e)},get value(){return this.getAttribute("value")},set value(e){
null===e?this.removeAttribute("value"):this.setAttribute("value",e)},get icon(){return this.getAttribute("icon");
},set icon(e){null===e?this.removeAttribute("icon"):this.setAttribute("icon",e)},
get iconSize(){return this.hasAttribute("iconsize")?i(this.getAttribute("iconsize")):20;
},set iconSize(e){this.setAttribute("iconsize",e)},get skin(){return this.getAttribute("skin");
},set skin(e){e?this.setAttribute("skin",e):this.removeAttribute("skin")},get href(){
return this.hasAttribute("href")?this.getAttribute("href"):""},set href(e){this.setAttribute("href",e);
},get pressed(){return this.hasAttribute("pressed")},set pressed(e){e===!0?this.setAttribute("pressed",""):this.removeAttribute("pressed");
},get mixed(){return this.hasAttribute("mixed")},set mixed(e){e===!0?this.setAttribute("mixed",""):this.removeAttribute("mixed");
},get disabled(){return this.hasAttribute("disabled")},set disabled(e){e===!0?this.setAttribute("disabled",""):this.removeAttribute("disabled");
},_onLabelAttributeChange:function(){this["#label"].textContent=this.label},_onIconAttributeChange:function(){
this["#icon-use"].remove(),this["#icon-use"]=t("svg:use"),this["#icon"].append(this["#icon-use"]),
this.icon&&this["#icon-use"].setAttribute("href","images/icons.svg#"+this.icon)},
_onIconSizeAttributeChange:function(){this["#icon"].style.width=this.iconSize+"px",
this["#icon"].style.height=this.iconSize+"px"},_onSkinAttributeChange:function(){
this._updateSkin()},_onHiddenAttributeChange:function(){this.dispatchEvent(new CustomEvent("hiddenchange",{
detail:this,bubbles:!0}))},_updateSkin:function(){this.skin?this["#skin-stylesheet"].innerText='@import url("api/stylesheets/bx-button@'+this.skin+'.css");':this["#skin-stylesheet"].innerText='@import url("api/stylesheets/bx-button.css");';
}},{},e)}(HTMLElement),o=n("bx-button",s);return{get default(){return o}}}),$traceurRuntime.registerModule("api/elements/bx-editor",[],function(){
"use strict";var e=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../utils","api/elements/bx-editor")).registerElement,t=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../classes/shortcut","api/elements/bx-editor"))["default"],n='\n  <style>@import url("'+BX_BASE_URL+'/stylesheets/bx-editor.css");</style>\n\n  <iframe\n    id="iframe"\n    src="'+BX_BASE_URL+'/frontend/editor.html"\n    sandbox="allow-same-origin allow-scripts"\n    name="Boxy SVG"\n    tabindex="-1"\n    seamless>\n  </iframe>\n',i=function(e){
function i(){$traceurRuntime.superConstructor(i).apply(this,arguments)}return $traceurRuntime.createClass(i,{
createdCallback:function(){var e=this;this._messageCounter=0,this._messageRequestCallbacks={},
this._messageResponseCallbacks={},this._iframeLoadedCallbacks=[],this._iframeInitializedCallbacks=[],
this._currentToolID=null,this._currentPrimaryPanelID=null,this._currentSecondaryPanelID=null,
this._changeCounter=0,this._shadowRoot=this.createShadowRoot({mode:"closed"}),this._shadowRoot.innerHTML=n;
var t=!0,i=!1,r=void 0;try{for(var s=void 0,o=this._shadowRoot.querySelectorAll("[id]")[Symbol.iterator]();!(t=(s=o.next()).done);t=!0){
var a=s.value;this["#"+a.id]=a}}catch(u){i=!0,r=u}finally{try{t||null==o["return"]||o["return"]();
}finally{if(i)throw r}}this.addEventListener("mousewheel",function(e){return e.preventDefault();
}),this["#iframe"].addEventListener("load",function(){return e._onIframeLoaded()}),
this.addMessageListener("event:toolchange",function(t){return e._currentToolID=t}),
this.addMessageListener("event:primarypanelchange",function(t){return e._currentPrimaryPanelID=t;
}),this.addMessageListener("event:secondarypanelchange",function(t){return e._currentSecondaryPanelID=t;
}),this.addMessageListener("event:shortcutpress",function(t){return e._onShortcutPress(t);
}),this.addMessageListener("getConfig",function(t,n){return n(e.owner.getConfig(t));
}),this.addMessageListener("setConfig",function(t){return e.owner.setConfig(t.key,t.value);
}),this.addMessageListener("getClipboardData",function(t,n){return n(e.owner.getClipboardData());
}),this.addMessageListener("setClipboardData",function(t){return e.owner.setClipboardData(t);
}),this.addMessageListener("setChangeCounter",function(t){return e._setChangeCounter(t);
}),this.addMessageListener("getBackendName",function(e,t){return t("embedded")}),
this.addMessageListener("showMessageBox",function(t,n){return e.owner.showMessageBox(t).then(n);
}),this.addMessageListener("openExternalURL",function(e){return window.open(e)}),
this.addMessageListener("exportFile",function(t){return e._exportFile(t)}),this.addMessageListener("canRasterizeArtwork",function(e,t){
return t(!1)})},attachedCallback:function(){var e=this;window.addEventListener("message",this._messageListener=function(t){
return e._onMessage(t)})},detachedCallback:function(){window.removeEventListener("message",this._messageListener);
},focus:function(){this["#iframe"].focus()},get owner(){for(var e=this;e;e=e.parentNode||e.host)if("boxy-svg"===e.localName)return e;
},get ready(){return null===this._iframeInitializedCallbacks},get currentToolID(){
return this._currentToolID},get currentPrimaryPanelID(){return this._currentPrimaryPanelID;
},get currentSecondaryPanelID(){return this._currentSecondaryPanelID},postMessage:function(e){
var t,n,i,r,s=arguments;return $traceurRuntime.asyncWrap(function(o){for(;;)switch(o.state){
case 0:t=void 0!==s[1]?s[1]:null,n=void 0!==s[2]?s[2]:null,o.state=4;break;case 4:
return void Promise.resolve(this._promiseIframeLoaded()).then(o.createCallback(2),o.errback);
case 2:i=this._messageCounter++,r={channel:"request",id:i,name:e,arg:t},n&&(this._messageResponseCallbacks[r.id]=n),
this["#iframe"].contentWindow.postMessage(r,"*"),o.state=-2;break;default:return o.end();
}},this)},addMessageListener:function(e,t){this._messageRequestCallbacks[e]||(this._messageRequestCallbacks[e]=[]),
this._messageRequestCallbacks[e].push(t)},removeMessageListener:function(e,t){this._messageRequestCallbacks[e]&&(this._messageRequestCallbacks[e]=this._messageRequestCallbacks[e].filter(function(e){
return e!==t}))},getArtwork:function(){var e=void 0!==arguments[0]?arguments[0]:"xml",t=this;
return new Promise(function(n,i){return $traceurRuntime.asyncWrap(function(i){for(;;)switch(i.state){
case 0:return void Promise.resolve(t.promiseReady()).then(i.createCallback(2),i.errback);
case 2:t.postMessage("getArtwork",e,function(e){return $traceurRuntime.asyncWrap(function(t){
for(;;)switch(t.state){case 0:t.returnValue=n(e),t.state=2;break;case 2:t.state=-2;
break;default:return t.end()}},this)}),i.state=-2;break;default:return i.end()}},this);
})},setArtwork:function(e){var t=this;if(this._setChangeCounter("reset"),this._initialized)this.postMessage("setArtwork",e);else{
this._initialized=!0;var n={artwork:e,hamburgerAppMenu:!0,restrictedFeatures:this.owner.restrictedFeatures,
assignedShortcuts:this.owner.assignedShortcuts};this.postMessage("init",n,function(){
return t._onIframeInitialized()})}},promiseReady:function(){return this._promiseIframeInitialized();
},_promiseIframeLoaded:function(){var e=this;return new Promise(function(t){e._iframeLoadedCallbacks?e._iframeLoadedCallbacks.push(t):t();
})},_promiseIframeInitialized:function(){var e=this;return new Promise(function(t){
e._iframeInitializedCallbacks?e._iframeInitializedCallbacks.push(t):t()})},_onIframeLoaded:function(){
var e=!0,t=!1,n=void 0;try{for(var i=void 0,r=this._iframeLoadedCallbacks[Symbol.iterator]();!(e=(i=r.next()).done);e=!0){
var s=i.value;s()}}catch(o){t=!0,n=o}finally{try{e||null==r["return"]||r["return"]();
}finally{if(t)throw n}}this._iframeLoadedCallbacks=null},_onIframeInitialized:function(){
this["#iframe"].style.visibility="visible";var e=!0,t=!1,n=void 0;try{for(var i=void 0,r=this._iframeInitializedCallbacks[Symbol.iterator]();!(e=(i=r.next()).done);e=!0){
var s=i.value;s()}}catch(o){t=!0,n=o}finally{try{e||null==r["return"]||r["return"]();
}finally{if(t)throw n}}this._iframeInitializedCallbacks=null,this.dispatchEvent(new CustomEvent("ready"));
},_onShortcutPress:function(e){var n=t.fromString(e);this.dispatchEvent(new CustomEvent("shortcutpress",{
bubbles:!0,detail:n}))},_onMessage:function(e){var t=this;if(e.source===this["#iframe"].contentWindow){
var n=e.data,i=n.channel,r=n.id,s=n.name,o=n.arg;"request"===i?this._messageRequestCallbacks[s]&&this._messageRequestCallbacks[s].forEach(function(e){
e(o,function(e){var n={channel:"response",id:r,name:s,arg:e};t["#iframe"].contentWindow.postMessage(n,"*");
})}):"response"===i&&this._messageResponseCallbacks[r]&&(this._messageResponseCallbacks[r](o),
delete this._messageResponseCallbacks[r])}},_setChangeCounter:function(e){var t=this._changeCounter;
"increment"===e?this._changeCounter+=1:"decrement"===e?this._changeCounter-=1:"reset"===e&&(this._changeCounter=0),
this.dispatchEvent(new CustomEvent("artworkchange")),0!==t!=(0!==this._changeCounter)&&this.dispatchEvent(new CustomEvent("editedchange"));
},_exportFile:function(e){var t=e,n=(t.format,t.data);window.open(n)}},{},e)}(HTMLElement),r=e("bx-editor",i);
return{get default(){return r}}}),$traceurRuntime.registerModule("api/elements/bx-hamburgermenu",[],function(){
"use strict";$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./bx-menu","api/elements/bx-hamburgermenu"));
var e=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../utils","api/elements/bx-hamburgermenu")),t=e.getClosestShadowRoot,n=e.registerElement,i=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../classes/shortcut","api/elements/bx-hamburgermenu"))["default"],r='\n  <style>@import url("'+BX_BASE_URL+'/stylesheets/bx-hamburgermenu.css");</style>\n\n  <div id="overlay" hidden></div>\n\n  <div id="button">\n    <svg id="icon" viewBox="0 0 100 100" preserveAspectRatio="none">\n      <rect x="-0.13" width="100.01" height="19.71" style="fill: inherit;"/>\n      <rect x="-0.13" y="80.29" width="100.01" height="19.71" style="fill: inherit;"/>\n      <rect x="-0.13" y="40.14" width="100.01" height="19.71" style="fill: inherit;"/>\n    </svg>\n  </div>\n\n  <bx-menu id="root-menu">\n    <content></content>\n  </bx-menu>\n',s=function(e){
function n(){$traceurRuntime.superConstructor(n).apply(this,arguments)}return $traceurRuntime.createClass(n,{
createdCallback:function(){var e=this;this.tabIndex=0,this._shadowRoot=this.createShadowRoot({
mode:"closed"}),this._shadowRoot.innerHTML=r;var t=!0,n=!1,i=void 0;try{for(var s=void 0,o=this._shadowRoot.querySelectorAll("[id]")[Symbol.iterator]();!(t=(s=o.next()).done);t=!0){
var a=s.value;this["#"+a.id]=a}}catch(u){n=!0,i=u}finally{try{t||null==o["return"]||o["return"]();
}finally{if(n)throw i}}this.addEventListener("menuitemtrigger",function(t){return e._close();
}),this.addEventListener("keydown",function(t){return e._onKeyDown(t)}),this["#overlay"].addEventListener("mousedown",function(t){
return e._onOverlayMouseDown(t)}),this["#button"].addEventListener("mousedown",function(t){
return e._onButtonMouseDown(t)}),$traceurRuntime.spread([this["#root-menu"]],this.querySelectorAll("bx-menu")).forEach(function(t){
t.menuWillShow=function(){return e.menuWillShow(t)},t.menuItemWillTrigger=function(t){
return e.menuItemWillTrigger(t)}})},get opened(){return this.hasAttribute("opened");
},get disabled(){return this.hasAttribute("disabled")},set disabled(e){e===!0?this.setAttribute("disabled",""):this.removeAttribute("disabled");
},menuWillShow:function(e){return Promise.resolve()},menuItemWillTrigger:function(e){
return Promise.resolve()},triggerItemForShortcut:function(e){var t=$traceurRuntime.spread(this.querySelectorAll("bx-menuitem"));
t=t.filter(function(e){return e.matches("bx-menuitem[hidden], *[hidden] bx-menuitem")===!1;
});var n=t.find(function(t){var n=t.userShortcut||t.shortcut||null;return n?n.compare(e):!1;
});if(n){var i=n.parentElement===this?this["#root-menu"]:n.parentElement;i.triggerItem(n);
}},_open:function(){var e=this;this.setAttribute("opened",""),this["#root-menu"].openNextToElement(this["#button"],5),
this["#overlay"].hidden=!1,window.addEventListener("resize",this._resizeListener=function(){
return e._close()}),window.addEventListener("blur",this._blurListener=function(){
return e._close()})},_close:function(){this.removeAttribute("opened"),this["#root-menu"].close(),
this["#overlay"].hidden=!0,window.removeEventListener("resize",this._resizeListener),
window.removeEventListener("blur",this._blurListener),this.blur()},_onOverlayMouseDown:function(e){
e.preventDefault(),this._close()},_onButtonMouseDown:function(e){this.disabled||this.opened===!1&&this._open();
},_onKeyDown:function(e){if(!this.disabled){var n=i.fromEvent(e);if(n.matches("ArrowUp")||n.matches("ArrowDown")){
var r=$traceurRuntime.spread(this.querySelectorAll("bx-menuitem[highlighted]")),s=r.length>0?r[r.length-1]:null,o=this["#root-menu"],a=this.querySelectorAll("bx-menu[opened]"),u=$traceurRuntime.spread([o],a);
if(s){var l=!0,c=!1,h=void 0;try{for(var m=void 0,d=u[Symbol.iterator]();!(l=(m=d.next()).done);l=!0){
var b=m.value;b.items.includes(s)&&(n.matches("ArrowUp")?b.highlightPreviousItem():b.highlightNextItem());
}}catch(f){c=!0,h=f}finally{try{l||null==d["return"]||d["return"]()}finally{if(c)throw h;
}}}else{var g=u.length>0?u[u.length-1]:null;g&&(n.matches("ArrowUp")?g.highlightPreviousItem():g.highlightNextItem());
}}else if(n.matches("ArrowLeft")){var v=this.querySelectorAll("bx-menu[opened]");if(v.length>0){
var p=v[v.length-1];p.items.find(function(e){return e.highlighted})&&p.highlightItem(null);
}}else if(n.matches("ArrowRight")){var x=$traceurRuntime.spread(this.querySelectorAll("bx-menuitem[highlighted]")),y=x.length>0?x[x.length-1]:null,w=y?y.querySelector("bx-menu"):null;
if(w){var C=w.getBoundingClientRect(),_=y.getBoundingClientRect(),k=C.left+C.width/2,R=_.top+_.height/2,A=t(this).elementFromPoint(k,R);
A.disabled?w.highlightNextItem(A):w.highlightItem(A)}}else if(n.matches("Enter")){
var M=$traceurRuntime.spread(this.querySelectorAll("bx-menuitem[highlighted]")),S=M.length>0?M[M.length-1]:null;
if(S){if(!S.querySelector("bx-menu")){var L=this["#root-menu"],j=this.querySelectorAll("bx-menu[opened]"),E=$traceurRuntime.spread([L],j),I=!0,$=!1,O=void 0;
try{for(var B=void 0,P=E[Symbol.iterator]();!(I=(B=P.next()).done);I=!0){var D=B.value;
if(D.items.includes(S)){D.triggerItem(S);break}}}catch(T){$=!0,O=T}finally{try{I||null==P["return"]||P["return"]();
}finally{if($)throw O}}}}else this._collapse()}else n.matches("Esc")?this._close():this.triggerItemForShortcut(n);
}}},{},e)}(HTMLElement),o=n("bx-hamburgermenu",s);return{get default(){return o}};
}),$traceurRuntime.registerModule("api/elements/bx-menu",[],function(){"use strict";
$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./bx-menuitem","api/elements/bx-menu"));
var e=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../utils","api/elements/bx-menu")),t=e.registerElement,n=e.sleep,i=75,r=300,s='\n  <style>\n    @import url("'+BX_BASE_URL+'/stylesheets/scrollbars.css");\n    @import url("'+BX_BASE_URL+'/stylesheets/bx-menu.css");\n  </style>\n\n  <main id="main">\n    <content id="content"></content>\n  </main>\n',o=function(e){
function t(){$traceurRuntime.superConstructor(t).apply(this,arguments)}return $traceurRuntime.createClass(t,{
createdCallback:function(){var e=this;this._mouseLocs=[],this._mouseInsideMenuBlock=!1,
this._shadowRoot=this.createShadowRoot({mode:"closed"}),this._shadowRoot.innerHTML=s;
var t=!0,n=!1,i=void 0;try{for(var r=void 0,o=this._shadowRoot.querySelectorAll("[id]")[Symbol.iterator]();!(t=(r=o.next()).done);t=!0){
var a=r.value;this["#"+a.id]=a}}catch(u){n=!0,i=u}finally{try{t||null==o["return"]||o["return"]();
}finally{if(n)throw i}}this["#main"].addEventListener("mousemove",function(t){return e._onMouseMove(t);
}),this.addEventListener("mouseover",function(t){return e._onMouseOver(t)}),this.addEventListener("mouseout",function(t){
return e._onMouseOut(t)}),this.addEventListener("click",function(t){return e._onClick(t);
})},menuWillShow:function(){return Promise.resolve()},menuItemWillTrigger:function(e){
return Promise.resolve()},get label(){return this.hasAttribute("label")?this.getAttribute("label"):"";
},set label(e){this.setAttribute("label",e)},get opened(){return this.hasAttribute("opened");
},get items(){var e=[],t=!0,n=!1,i=void 0;try{for(var r=void 0,s=this.children[Symbol.iterator]();!(t=(r=s.next()).done);t=!0){
var o=r.value;if("content"===o.localName){var a=!0,u=!1,l=void 0;try{for(var c=void 0,h=o.getDistributedNodes()[Symbol.iterator]();!(a=(c=h.next()).done);a=!0){
var m=c.value;"bx-menuitem"!==m.localName&&"hr"!==m.localName||e.push(m)}}catch(d){
u=!0,l=d}finally{try{a||null==h["return"]||h["return"]()}finally{if(u)throw l}}}else"bx-menuitem"!==o.localName&&"hr"!==o.localName||e.push(o);
}}catch(b){n=!0,i=b}finally{try{t||null==s["return"]||s["return"]()}finally{if(n)throw i;
}}return e},openBelowElement:function(e){var t,n,i,r=arguments;return $traceurRuntime.asyncWrap(function(s){
for(;;)switch(s.state){case 0:t=void 0!==r[1]?r[1]:0,s.state=4;break;case 4:return void Promise.resolve(this.menuWillShow()).then(s.createCallback(2),s.errback);
case 2:this.setAttribute("opened",""),n=e.getBoundingClientRect(),this.style.height=null,
this.style.top=n.top+n.height+t+"px",this.style.left=n.left+"px",i=this.getBoundingClientRect(),
i.left+i.width>window.innerWidth&&(this.style.left=n.left+n.width-i.width+"px"),i.top+i.height+t+5>window.innerHeight&&(this.style.height=window.innerHeight-(n.top+n.height+t)-10+"px"),
this.dispatchEvent(new CustomEvent("menuopen",{bubbles:!0,detail:this})),s.state=-2;
break;default:return s.end()}},this)},openNextToElement:function(e){var t,n,i,r,s=arguments;
return $traceurRuntime.asyncWrap(function(o){for(;;)switch(o.state){case 0:t=void 0!==s[1]?s[1]:0,
o.state=4;break;case 4:return void Promise.resolve(this.menuWillShow()).then(o.createCallback(2),o.errback);
case 2:this.setAttribute("opened",""),n=e.getBoundingClientRect(),this.style.height=null,
this.style.top=n.top+"px",this.style.left=n.left+n.width+t+"px",i=this.getBoundingClientRect(),
i.left+i.width+t>window.innerWidth&&(this.style.left=n.left-i.width-t+"px",i=this.getBoundingClientRect()),
i.top+i.height+5>window.innerHeight&&(r=window.innerHeight-(i.top+i.height)-5,this.style.top=n.top+r+"px",
i=this.getBoundingClientRect(),i.top<0&&(this.style.top="5px",this.style.height=window.innerHeight-10+"px")),
this.dispatchEvent(new CustomEvent("menuopen",{bubbles:!0,detail:this})),o.state=-2;
break;default:return o.end()}},this)},openAtPosition:function(e,t){var n,i;return $traceurRuntime.asyncWrap(function(r){
for(;;)switch(r.state){case 0:return void Promise.resolve(this.menuWillShow()).then(r.createCallback(2),r.errback);
case 2:this.setAttribute("opened",""),this.style.height=null,this.style.left=e+"px",
this.style.top=t+"px",n=this.getBoundingClientRect(),n.left+n.width>window.innerWidth&&(this.style.left=e-n.width+"px",
n=this.getBoundingClientRect()),n.top+n.height+5>window.innerHeight&&(i=window.innerHeight-(n.top+n.height)-5,
this.style.top=t+i+"px",n=this.getBoundingClientRect(),n.top<0&&(this.style.top="5px",
this.style.height=window.innerHeight-10+"px")),this.dispatchEvent(new CustomEvent("menuopen",{
bubbles:!0,detail:this})),r.state=-2;break;default:return r.end()}},this)},close:function(){
var e=!0,t=!1,n=void 0;try{for(var i=void 0,r=this.items[Symbol.iterator]();!(e=(i=r.next()).done);e=!0){
var s=i.value;s.highlighted&&(s.highlighted=!1)}}catch(o){t=!0,n=o}finally{try{e||null==r["return"]||r["return"]();
}finally{if(t)throw n}}this.style.left=null,this.style.top=null,this.removeAttribute("opened"),
this._openedSubmenu&&(this._openedSubmenu.close(),this._openedSubmenu=null),this.dispatchEvent(new CustomEvent("menuclose",{
bubbles:!0,detail:this}))},triggerItem:function(e){var t=this;return new Promise(function(i){
var r,s,o,a,u,l;return $traceurRuntime.asyncWrap(function(c){for(;;)switch(c.state){
case 0:return void Promise.resolve(t.menuItemWillTrigger(e)).then(c.createCallback(2),c.errback);
case 2:c.state=e.disabled===!1&&0===e.childElementCount?13:16;break;case 13:c.state=t.opened?7:12;
break;case 7:r=!0,s=!1,o=void 0;try{for(a=void 0,u=t.items[Symbol.iterator]();!(r=(a=u.next()).done);r=!0)l=a.value,
l.highlighted&&(l.highlighted=!1)}catch(h){s=!0,o=h}finally{try{r||null==u["return"]||u["return"]();
}finally{if(s)throw o}}t._willClose=!0,c.state=8;break;case 8:return void Promise.resolve(n(100)).then(c.createCallback(4),c.errback);
case 4:e.highlighted=!0,c.state=10;break;case 10:return void Promise.resolve(n(100)).then(c.createCallback(6),c.errback);
case 6:e.highlighted=!1,t._willClose=!1,t.close(),c.state=12;break;case 12:t.dispatchEvent(new CustomEvent("menuitemtrigger",{
bubbles:!0,detail:e})),i(),c.state=-2;break;case 16:i(),c.state=-2;break;default:
return c.end()}},this)})},highlightItem:function(e){var t,i;return $traceurRuntime.asyncWrap(function(r){
for(;;)switch(r.state){case 0:r.state=this._willClose?1:3;break;case 1:r.returnValue=void 0,
r.state=2;break;case 2:r.state=-2;break;case 3:t=this.items.find(function(e){return e.highlighted===!0;
}),r.state=21;break;case 21:r.state=t?10:7;break;case 10:r.state=t===e?5:8;break;case 5:
r.returnValue=void 0,r.state=6;break;case 6:r.state=-2;break;case 8:t.highlighted=!1,
r.state=7;break;case 7:this._openedSubmenu&&(this._openedSubmenu.close(),this._openedSubmenu=null),
r.state=23;break;case 23:r.state=e&&e.disabled===!1?17:-2;break;case 17:i=e.children[0]&&"bx-menu"===e.children[0].localName?e.children[0]:null,
e.highlighted=!0,r.state=18;break;case 18:r.state=i?12:-2;break;case 12:return void Promise.resolve(n(100)).then(r.createCallback(13),r.errback);
case 13:e.highlighted&&e.highlighted&&(this._openedSubmenu=i,i.openNextToElement(e,0)),
r.state=-2;break;default:return r.end()}},this)},highlightPreviousItem:function(){
var e=void 0!==arguments[0]?arguments[0]:null,t=this.items;if(null===e&&(e=t.find(function(e){
return e.highlighted===!0})),e)for(var n=t.indexOf(e)-1;n>=0;n-=1){var i=t[n];if(i.disabled===!1&&i.hidden===!1&&"bx-menuitem"===i.localName)return this.highlightItem(i),
void i.scrollIntoViewIfNeeded()}for(var r=t.length-1;r>=0;r-=1){var s=t[r];if(s.disabled===!1&&s.hidden===!1&&"bx-menuitem"===s.localName&&s!==e)return this.highlightItem(s),
void s.scrollIntoViewIfNeeded()}},highlightNextItem:function(){var e=void 0!==arguments[0]?arguments[0]:null,t=this.items;
if(null===e&&(e=t.find(function(e){return e.highlighted===!0})),e)for(var n=t.indexOf(e)+1;n<t.length;n+=1){
var i=t[n];if(i.disabled===!1&&i.hidden===!1&&"bx-menuitem"===i.localName)return this.highlightItem(i),
void i.scrollIntoViewIfNeeded()}for(var r=0;r<t.length;r+=1){var s=t[r];if(s.disabled===!1&&s.hidden===!1&&"bx-menuitem"===s.localName&&s!==e)return this.highlightItem(s),
void s.scrollIntoViewIfNeeded()}},_onMouseMove:function(e){this._mouseLocs.push({
x:e.pageX,y:e.pageY}),this._mouseLocs.length>3&&this._mouseLocs.shift()},_onMouseOver:function(e){
e.target===this||e.target.parentElement===this||this.items.includes(e.target)?(this._mouseInsideMenuBlock===!1&&(this._mouseInsideMenuBlock=!0),
"bx-menuitem"===e.target.localName&&this._onMenuItemMouseEnter(e.target)):this._mouseInsideMenuBlock===!0&&(this._mouseInsideMenuBlock=!1,
this._onMenuBlockMouseLeave())},_onMouseOut:function(e){e.toElement&&(e.toElement===this||this.items.includes(e.toElement))||this._mouseInsideMenuBlock===!0&&(this._mouseInsideMenuBlock=!1,
this._onMenuBlockMouseLeave())},_onClick:function(e){if(0===e.button&&"bx-menuitem"===e.target.localName&&(e.target.parentElement===this||this.items.includes(e.target))){
var t=e.target;this.triggerItem(t)}},_onMenuItemMouseEnter:function(e){this._timeoutID&&clearTimeout(this._timeoutID),
this._highlightItemWithDelay(e)},_onMenuBlockMouseLeave:function(){this._timeoutID&&clearTimeout(this._timeoutID);
var e=this.items.find(function(e){return e.highlighted===!0});if(e){var t=e.children[0];
t&&t.opened!==!1||(e.highlighted=!1)}},_highlightItemWithDelay:function(e){var t=this,n=this._getHighlightDelay();
n?this._timeoutID=setTimeout(function(){t._highlightItemWithDelay(e)},n):this.highlightItem(e);
},_getHighlightDelay:function(){var e="right",t=this._mouseLocs[this._mouseLocs.length-1],n=this._mouseLocs[0];
if(!this._openedSubmenu)return 0;if(!t)return 0;n||(n=t);var s=this.getBoundingClientRect(),o={
x:s.left,y:s.top-i},a={x:s.left+s.width,y:o.y},u={x:s.left,y:s.top+s.height+i},l={
x:s.left+s.width,y:u.y};if(n.x<s.left||n.x>l.x||n.y<s.top||n.y>l.y)return 0;if(this._lastDelayLoc&&t.x==this._lastDelayLoc.x&&t.y==this._lastDelayLoc.y)return 0;
var c=a,h=l;"left"==e?(c=u,h=o):"below"==e?(c=l,h=u):"above"==e&&(c=o,h=a);var m=function(e,t){
return(t.y-e.y)/(t.x-e.x)},d=m(t,c),b=m(t,h),f=m(n,c),g=m(n,h);return f>d&&b>g?(this._lastDelayLoc=t,
r):(this._lastDelayLoc=null,0)}},{},e)}(HTMLElement),a=t("bx-menu",o);return{get default(){
return a}}}),$traceurRuntime.registerModule("api/elements/bx-menuitem",[],function(){
"use strict";var e=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../utils","api/elements/bx-menuitem")).registerElement,t=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../classes/shortcut","api/elements/bx-menuitem"))["default"],n='\n  <style>@import url("'+BX_BASE_URL+'/stylesheets/bx-menuitem.css");</style>\n\n  <main>\n    <div id="state-icons">\n      <svg class="icon" id="selected-state-icon" viewBox="0 0 100 100" hidden>\n        <ellipse cx="50" cy="49.9269" rx="49.6429" ry="49.7161" style="fill: inherit; stroke: none;"/>\n      </svg>\n\n      <svg class="icon" id="toggled-state-icon" viewBox="0 0 100 100" hidden>\n        <path style="fill: inherit; stroke: none;" id="path7490-3-3" d="M 7.492 61.188 C 7.492 61.188 39.824 99.976 39.824 99.976 C 39.824 99.976 100 5.774 100 5.774 C 100 5.774 80.177 -0.048 80.177 -0.048 C 80.177 -0.048 38.315 65.013 38.315 65.013 C 38.315 65.013 16.459 38.82 16.459 38.82 C 16.459 38.82 0 51.21 0 51.21"/>\n      </svg>\n    </div>\n\n    <div id="label"></div>\n    <div id="shortcut"></div>\n\n    <svg id="arrow-icon" viewBox="0 0 100 100">\n      <path d="M 0 0.819 C 0 0.819 0 99.145 0 99.145 C 0 99.145 100 49.983 100 49.983 C 100 49.983 0 0.819 0 0.819 Z"/>\n    </svg>\n  </main>\n\n  <content select="bx-menu"></content>\n',i=function(e){
function i(){$traceurRuntime.superConstructor(i).apply(this,arguments)}return $traceurRuntime.createClass(i,{
createdCallback:function(){this._shadowRoot=this.createShadowRoot({mode:"closed"}),
this._shadowRoot.innerHTML=n;var e=!0,t=!1,i=void 0;try{for(var r=void 0,s=this._shadowRoot.querySelectorAll("[id]")[Symbol.iterator]();!(e=(r=s.next()).done);e=!0){
var o=r.value;this["#"+o.id]=o}}catch(a){t=!0,i=a}finally{try{e||null==s["return"]||s["return"]();
}finally{if(t)throw i}}var u=!0,l=!1,c=void 0;try{for(var h=void 0,m=this.attributes[Symbol.iterator]();!(u=(h=m.next()).done);u=!0){
var d=h.value;this.attributeChangedCallback(d.name)}}catch(b){l=!0,c=b}finally{try{
u||null==m["return"]||m["return"]()}finally{if(l)throw c}}},attributeChangedCallback:function(e){
"label"===e?this._onLabelAttributeChange():"state"===e?this._onStateAttributeChange():"shortcut"!==e&&"usershortcut"!==e||this._onShortcutAttributeChange();
},get label(){return this.hasAttribute("label")?this.getAttribute("label"):""},set label(e){
this.setAttribute("label",e)},get state(){return this.hasAttribute("state")?this.getAttribute("state"):null;
},set state(e){null===e?this.removeAttribute("state"):this.setAttribute("state",e);
},get commandID(){return this.hasAttribute("commandid")?this.getAttribute("commandid"):"";
},set commandID(e){this.setAttribute("commandid",e)},get shortcut(){return this.hasAttribute("shortcut")?t.fromString(this.getAttribute("shortcut")):null;
},set shortcut(e){null===e?this.removeAttribute("shortcut"):this.setAttribute("shortcut",e.toString());
},get userShortcut(){return this.hasAttribute("usershortcut")?t.fromString(this.getAttribute("usershortcut")):null;
},set userShortcut(e){null===e?this.removeAttribute("usershortcut"):this.setAttribute("usershortcut",e.toString());
},get highlighted(){return this.hasAttribute("highlighted")},set highlighted(e){e?this.setAttribute("highlighted",""):this.removeAttribute("highlighted");
},get disabled(){return this.hasAttribute("disabled")},set disabled(e){e?this.setAttribute("disabled",""):this.removeAttribute("disabled");
},_onLabelAttributeChange:function(){this["#label"].textContent=this.label},_onStateAttributeChange:function(){
"selected"===this.state?(this["#selected-state-icon"].removeAttribute("hidden"),this["#toggled-state-icon"].setAttribute("hidden","")):"toggled"===this.state?(this["#selected-state-icon"].setAttribute("hidden",""),
this["#toggled-state-icon"].removeAttribute("hidden")):(this["#selected-state-icon"].setAttribute("hidden",""),
this["#toggled-state-icon"].setAttribute("hidden",""))},_onShortcutAttributeChange:function(){
var e=this.userShortcut||this.shortcut||null;e?this["#shortcut"].textContent=e.toDisplayString():this["#shortcut"].textContent="";
}},{},e)}(HTMLElement),r=e("bx-menuitem",i);return{get default(){return r}}}),$traceurRuntime.registerModule("api/elements/bx-messagebox",[],function(){
"use strict";$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("./bx-button","api/elements/bx-messagebox"));
var e=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../utils","api/elements/bx-messagebox")),t=e.createElement,n=e.registerElement,i=e.sleep,r={
message:"Sample message",detail:"",buttons:["Confirm","Cancel"]},s='\n  <style>@import url("'+BX_BASE_URL+'/stylesheets/bx-messagebox.css");</style>\n\n  <div id="inner">\n    <svg id="icon" viewBox="0 0 100 100">\n      <path d="M 57.085 82.615 C 57.085 82.615 57.085 71.23 57.085 71.23 C 57.085 70.615 56.9 70.23 56.531 69.846 C 56.199 69.461 55.793 69.231 55.314 69.231 C 55.314 69.231 44.686 69.231 44.686 69.231 C 44.207 69.231 43.782 69.461 43.413 69.846 C 43.081 70.23 42.915 70.615 42.915 71.23 C 42.915 71.23 42.915 82.615 42.915 82.615 C 42.915 83.23 43.081 83.692 43.413 84.076 C 43.782 84.461 44.207 84.615 44.686 84.615 C 44.686 84.615 55.314 84.615 55.314 84.615 C 55.793 84.615 56.199 84.461 56.531 84.076 C 56.9 83.692 57.085 83.153 57.085 82.615 M 56.974 60.153 C 56.974 60.153 57.97 32.539 57.97 32.539 C 57.97 32.077 57.786 31.692 57.417 31.461 C 56.937 31 56.494 30.769 56.089 30.769 C 56.089 30.769 43.911 30.769 43.911 30.769 C 43.506 30.769 43.063 31 42.583 31.461 C 42.214 31.692 42.029 32.154 42.029 32.692 C 42.029 32.692 42.97 60.153 42.97 60.153 C 42.97 60.538 43.155 60.924 43.524 61.153 C 43.893 61.384 44.336 61.538 44.852 61.538 C 44.852 61.538 55.092 61.538 55.092 61.538 C 55.609 61.538 56.033 61.384 56.365 61.153 C 56.734 60.924 56.937 60.538 56.974 60.153 M 56.199 4 C 56.199 4 98.708 88.615 98.708 88.615 C 100 91.153 99.963 93.692 98.598 96.23 C 97.97 97.385 97.103 98.307 95.996 98.999 C 94.926 99.691 93.764 100 92.509 100 C 92.509 100 7.491 100 7.491 100 C 6.236 100 5.055 99.691 3.948 98.999 C 2.878 98.307 2.03 97.385 1.402 96.23 C 0.037 93.692 0 91.153 1.292 88.615 C 1.292 88.615 43.801 4 43.801 4 C 44.428 2.769 45.295 1.769 46.402 1.077 C 47.509 0.385 48.708 0 50 0 C 51.291 0 52.491 0.385 53.598 1.077 C 54.705 1.769 55.572 2.769 56.199 4" id="path9166"/>\n    </svg>\n\n    <div id="headers">\n      <h1 id="message"></h1>\n      <h2 id="detail"></h2>\n    </div>\n  </div>\n\n  <div id="buttons"></div>\n',o=function(e){
function n(){$traceurRuntime.superConstructor(n).apply(this,arguments)}return $traceurRuntime.createClass(n,{
createdCallback:function(){var e=this;this.tabIndex=1,this._shadowRoot=this.createShadowRoot({
mode:"closed"}),this._shadowRoot.innerHTML=s;var t=!0,n=!1,i=void 0;try{for(var r=void 0,o=this._shadowRoot.querySelectorAll("[id]")[Symbol.iterator]();!(t=(r=o.next()).done);t=!0){
var a=r.value;this["#"+a.id]=a}}catch(u){n=!0,i=u}finally{try{t||null==o["return"]||o["return"]();
}finally{if(n)throw i}}this["#buttons"].addEventListener("click",function(t){return e._onButtonClick(t);
}),this.addEventListener("keydown",function(t){return e._onKeyDown(t)})},showModal:function(){
var e,s,o,a,u,l,c=arguments;return $traceurRuntime.asyncWrap(function(h){for(;;)switch(h.state){
case 0:for(e=void 0!==c[0]?c[0]:r,s=e.message||r.message,o=e.detail||r.detail,a=e.buttons||r.buttons,
this["#message"].innerHTML=s,this["#detail"].innerHTML=o,this["#buttons"].innerHTML="",
u=0;u<a.length;u+=1)l=t("bx-button"),l.value=u,l.label=a[u],l.skin="bx-messagebox",
this["#buttons"].append(l);this["#buttons"].lastElementChild&&this["#buttons"].lastElementChild.setAttribute("default",""),
h.state=4;break;case 4:return void Promise.resolve(i(100)).then(h.createCallback(2),h.errback);
case 2:$traceurRuntime.superGet(this,n.prototype,"showModal").call(this),this.focus(),
h.state=-2;break;default:return h.end()}},this)},_onButtonClick:function(e){var t,n;
return $traceurRuntime.asyncWrap(function(r){for(;;)switch(r.state){case 0:r.state=0===e.button&&"bx-button"===e.target.localName?3:-2;
break;case 3:t=e.target,n=e.target.value,t.style.pointerEvents="none",r.state=4;break;
case 4:return void Promise.resolve(i(200)).then(r.createCallback(2),r.errback);case 2:
delete t.style.pointerEvents,this.close(n),r.state=-2;break;default:return r.end();
}},this)},_onKeyDown:function(e){if(13===e.keyCode){var t=this["#buttons"].lastElementChild?this["#buttons"].lastElementChild.value:null;
this.close(t)}else 27===e.keyCode&&(e.preventDefault(),this.close("cancel"))}},{},e);
}(HTMLDialogElement),a=n("dialog","bx-messagebox",o);return{get default(){return a;
}}}),$traceurRuntime.registerModule("api/elements/bx-preferences",[],function(){"use strict";
var e=$traceurRuntime.getModule($traceurRuntime.normalizeModuleName("../utils","api/elements/bx-preferences")).registerElement,t='\n  <style>@import url("'+BX_BASE_URL+'/stylesheets/bx-preferences.css");</style>\n\n  <div id="container">\n    <header id="header">\n      <div id="back-button">\n        <svg class="icon" id="back-icon" viewBox="0 0 100 100" hidden>\n          <path d="M 99.141 44.381 C 99.141 44.381 23.732 44.381 23.732 44.381 C 23.732 44.381 58.369 12.969 58.369 12.969 C 58.369 12.969 49.57 5.046 49.57 5.046 C 49.57 5.046 0 50 0 50 C 0 50 49.57 94.954 49.57 94.954 C 49.57 94.954 58.307 87.031 58.307 87.031 C 58.307 87.031 23.732 55.619 23.732 55.619 C 23.732 55.619 99.141 55.619 99.141 55.619 C 99.141 55.619 99.141 44.381 99.141 44.381 Z"/>\n        </svg>\n        <h1>Preferences</h1>\n      </div>\n    </header>\n\n    <iframe\n      id="iframe"\n      sandbox="allow-same-origin allow-scripts"\n      name="Boxy SVG"\n      tabindex="-1"\n      seamless>\n    </iframe>\n  </div>\n',n=function(e){
function n(){$traceurRuntime.superConstructor(n).apply(this,arguments)}return $traceurRuntime.createClass(n,{
createdCallback:function(){var e=this;this._messageCounter=0,this._messageRequestCallbacks={},
this._messageResponseCallbacks={},this._iframeLoadedCallbacks=[],this._shadowRoot=this.createShadowRoot({
mode:"closed"}),this._shadowRoot.innerHTML=t;var n=!0,i=!1,r=void 0;try{for(var s=void 0,o=this._shadowRoot.querySelectorAll("[id]")[Symbol.iterator]();!(n=(s=o.next()).done);n=!0){
var a=s.value;this["#"+a.id]=a}}catch(u){i=!0,r=u}finally{try{n||null==o["return"]||o["return"]();
}finally{if(i)throw r}}var l=!0,c=!1,h=void 0;try{for(var m=void 0,d=this.attributes[Symbol.iterator]();!(l=(m=d.next()).done);l=!0){
var b=m.value;this.attributeChangedCallback(b.name)}}catch(f){c=!0,h=f}finally{try{
l||null==d["return"]||d["return"]()}finally{if(c)throw h}}this.addMessageListener("getConfig",function(t,n){
return n(e.owner.getConfig(t))}),this.addMessageListener("setConfig",function(t){
return e.owner.setConfig(t.key,t.value)}),this.addMessageListener("getShortcutsEditorModel",function(t,n){
return n(e.owner.getShortcutsEditorModel())}),this.addMessageListener("getBackendName",function(e,t){
return t("embedded")}),this["#iframe"].addEventListener("load",function(){return e._onIframeLoaded();
}),this["#back-button"].addEventListener("click",function(t){return e._onBackButtonClick(t);
})},attributeChangedCallback:function(e){"enabled"===e&&this._onEnabledAttributeChange();
},get owner(){for(var e=this;e;e=e.parentNode||e.host)if("boxy-svg"===e.localName)return e;
},get ready(){return null===this._iframeLoadedCallbacks},get enabled(){return this.hasAttribute("enabled");
},set enabled(e){e===!0?this.setAttribute("enabled",""):this.removeAttribute("enabled");
},focus:function(){this["#iframe"].focus()},promiseReady:function(){var e=this;return new Promise(function(t){
e._iframeLoadedCallbacks?e._iframeLoadedCallbacks.push(t):t()})},postMessage:function(e){
var t,n,i,r,s=arguments;return $traceurRuntime.asyncWrap(function(o){for(;;)switch(o.state){
case 0:t=void 0!==s[1]?s[1]:null,n=void 0!==s[2]?s[2]:null,o.state=4;break;case 4:
return void Promise.resolve(this.promiseReady()).then(o.createCallback(2),o.errback);
case 2:i=this._messageCounter++,r={channel:"request",id:i,name:e,arg:t},n&&(this._messageResponseCallbacks[r.id]=n),
this["#iframe"].contentWindow.postMessage(r,"*"),o.state=-2;break;default:return o.end();
}},this)},addMessageListener:function(e,t){this._messageRequestCallbacks[e]||(this._messageRequestCallbacks[e]=[]),
this._messageRequestCallbacks[e].push(t)},removeMessageListener:function(e,t){this._messageRequestCallbacks[e]&&(this._messageRequestCallbacks[e]=this._messageRequestCallbacks[e].filter(function(e){
return e!==t}))},_onEnabledAttributeChange:function(){this.enabled?this._onEnabled():this._onDisabled();
},_onEnabled:function(){var e=this;window.addEventListener("message",this._messageListener=function(t){
return e._onMessage(t)}),""===this["#iframe"].src&&(this["#iframe"].src=BX_BASE_URL+"/frontend/preferences.html");
},_onDisabled:function(){window.removeEventListener("message",this._messageListener);
},_onMessage:function(e){var t=this;if(e.source===this["#iframe"].contentWindow){
var n=e.data,i=n.channel,r=n.id,s=n.name,o=n.arg;"request"===i?this._messageRequestCallbacks[s]&&this._messageRequestCallbacks[s].forEach(function(e){
e(o,function(e){var n={channel:"response",id:r,name:s,arg:e};t["#iframe"].contentWindow.postMessage(n,"*");
})}):"response"===i&&this._messageResponseCallbacks[r]&&(this._messageResponseCallbacks[r](o),
delete this._messageResponseCallbacks[r])}},_onIframeLoaded:function(){if(""!==this["#iframe"].src){
var e=!0,t=!1,n=void 0;try{for(var i=void 0,r=this._iframeLoadedCallbacks[Symbol.iterator]();!(e=(i=r.next()).done);e=!0){
var s=i.value;s()}}catch(o){t=!0,n=o}finally{try{e||null==r["return"]||r["return"]();
}finally{if(t)throw n}}this._iframeLoadedCallbacks=null,this.postMessage("init")}
},_onBackButtonClick:function(e){this.dispatchEvent(new CustomEvent("backbutonclick"));
}},{},e)}(HTMLElement),i=e("bx-preferences",n);return{get default(){return i}}}),
$traceurRuntime.registerModule("api/utils",[],function(){"use strict";var e="http://www.w3.org/2000/svg",t="http://www.w3.org/1999/xlink",n="http://www.w3.org/1999/xhtml",i="http://www.w3.org/1998/Math/MathML",r="http://www.w3.org/2000/xmlns/",s="http://www.boxy-svg.com/bx",o=function(e,t){
var n=void 0!==arguments[2]?arguments[2]:null;if(null===n){var i=t;return document.registerElement(e,i);
}var r=t,s=n;return document.registerElement(r,{"extends":e,prototype:s.prototype
})},a=function(t){var n,i,r,s,o=void 0!==arguments[1]?arguments[1]:null,a=t.split(":"),u=null;
if(1===a.length){var l=(n=a[Symbol.iterator](),(i=n.next()).done?void 0:i.value);u=document.createElement(l,o);
}else if(2===a.length){var c=a,h=(r=c[Symbol.iterator](),(s=r.next()).done?void 0:s.value),m=(s=r.next()).done?void 0:s.value;
"svg"===h&&(u=document.createElementNS(e,m,o))}return u},u=function(e){for(var t=e;t;t=t.parentNode)if(t instanceof ShadowRoot||t===window.document)return t;
},l=function(e){return e.replace(/([A-Z])/g,function(e){return"-"+e.toLowerCase();
})},c=function(e){return new Promise(function(t,n){setTimeout(function(){return t();
},e)})};return{get SVG_NAMESPACE(){return e},get XLINK_NAMESPACE(){return t},get XHTML_NAMESPACE(){
return n},get MATHML_NAMESPACE(){return i},get XMLNS_NAMESPACE(){return r},get BX_NAMESPACE(){
return s},get registerElement(){return o},get createElement(){return a},get getClosestShadowRoot(){
return u},get toDashCase(){return l},get sleep(){return c}}});
