// TODO: Maybe we should use the commonjs loader from the addon SDK?

const {classes: Cc, Constructor: CC, interfaces: Ci, utils: Cu,
     results: Cr, manager: Cm } = Components;

// Note that goog.dependencies_.written in our context means "loaded" instead

// TODO: Is this the best way to load script?
let (i = 0) {
  function loadScript(url, context) {
    var ctx = context || {};
    var scope = {};
    Cu.import("resource://gre/modules/Services.jsm", scope);
    var {Services} = scope;
    // EXPORTED_SYMBOLS problem, so we need to use this instead of
    // Cu.import
    i++;
    Services.scriptloader.loadSubScript(url+"?t="+i, ctx);
    return ctx;
  }
};


function goog_make_env(baseURL) {
  // TODO: Do we really need a system principal?
  var principal = CC("@mozilla.org/systemprincipal;1", "nsIPrincipal")();
  // TODO: And do we really need a sandbox?
  return new Cu.Sandbox(principal, {
    sandboxPrototype: {
      CLOSURE_BASE_PATH: baseURL
    },
    // TODO: Do we need really this?
    wantXrays: false
  });
}


function goog_url(module, env) {
  if (!env.CLOSURE_BASE_PATH) {
    throw Error("CLOSURE_BASE_PATH not set");
  }
  return env.CLOSURE_BASE_PATH + module + ".js";
}


function goog_set_up(env) {
  // src is a URL
  env.CLOSURE_IMPORT_SCRIPT = function(src) {
    // TODO: How do we handle possible errors here?
    loadScript(src, env);
    return true;
  };
  loadScript(goog_url("base", env), env);
  // XXX
  var provide0 = env.goog.provide;
  env.goog.provide = function(name) {
    try {
      provide0(name);
    } catch (e) {
      var message = e.message || "";
      if (!(message.indexOf("Namespace") > -1 &&
            message.indexOf("already declared") > -1)) {
        throw e;
      } else {
        // Just reloading, goog.provide is crazy for not allowing
        // providing twice
      }
    }
  };

  // TODO: Maybe this should be optional?
  loadScript(goog_url("deps", env), env);
}


function goog_new_env(
  baseURL/* root goog dir */,
  deps/* dependency list (of [file, provides, requires]) */,
  additions/* additional globals (namespaces) */,
  depsURL/* depedency file */) {
  var env = goog_make_env(baseURL);
  goog_set_up(env);
  deps.forEach(function(dep) {
    let [file, provides, requires] = dep;
    env.goog.addDependency(file, provides, requires);
  });
  for (var ns in additions) {
    let module = additions[ns];
    env.goog.provide(ns);
    env[ns] = module;
  }
  loadScript(depsURL, env);
  return env;
}

function main() {
  var base = "file:///home/ubolonton/Programming/projects/cljs-xulrunner/";
  var baseURL = base + "build/goog/";
  var depsURL = base + "build/deps.js";

  var env = goog_new_env(
    baseURL, [], {}, depsURL
  );

  return env;
}

// b = loadScript("file:///home/ubolonton/Programming/projects/cljs-xulrunner/src/js/bootstrap.js")b = loadScript("file:///home/ubolonton/Programming/projects/cljs-xulrunner/src/js/bootstrap.js");
